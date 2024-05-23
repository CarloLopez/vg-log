import { BacklogItemState } from "../types/gameTypes";
import { gameGenres } from "./filterObjects";
import getBacklogGameInfo from "../api/recommender/getBacklogGameInfo";
import getGamesByGenres from "../api/recommender/getGamesByGenres";
import { Image } from "../types/gameTypes";
import { BacklogSettings, DatabaseSettings, FilterSettings } from "../components/pages/Home/HomeRecommender/HomeRecommender";

type GameDetail = {
  id: number;
  genres: number[];
  platforms: string[];
}

export type DbGameResult = {
  id: number;
  name: string;
  slug: string;
  cover: Image;
  total_rating: number;
  total_rating_count: number;
  genres: number[];
  vector?: number[];
  similarity?: number;
  overallScore?: number;
}

type APIResult = {
  name: string;
  result: DbGameResult[];
}

export type getDbVectorsParams = {
  regularResults: APIResult;
  reverseResults: APIResult;
}

type SelectGenreFiltersParams = {
  genres: [string, number][];
  reverse: boolean;
  genreDepth: number;
}

type FilterResultsParams = {
  results: DbGameResult[];
  reverse: boolean;
  filterSettings: FilterSettings;
}

type NormaliseParams = {
  value: number;
  min: number;
  max: number;
}

class GameRecommender {
  private games: BacklogItemState[];
  private results: APIResult[];
  private genreFrequency: { [genreId: number]: number};
  private platforms: string[];

  constructor(games: BacklogItemState[] = []) {
    this.games = games;
    this.results = [];
    this.genreFrequency = {};
    this.platforms = [];
  }

  async getBacklogInfo(backlogSettings:BacklogSettings) {
    
    // filter for only selected statuses
    const statuses = backlogSettings.statuses;
    const backlogInfo = await this._fetchDetails(statuses);

    // tally genre ids for games in the backlog
    this.genreFrequency = this._calculateGenreFrequency(backlogInfo);
    this.platforms = this._getPlatforms(backlogInfo);
  }

  calculateUserVector() {
    // create vector for similarity analysis based on the frequencies
    const filledVector = gameGenres.map(genre => this.genreFrequency[Number(genre.id)]);

    // normalise vector to avoid overweighting high frequency games
    return this._normaliseVector(filledVector);
  }

  async getDbGames(databaseSettings: DatabaseSettings) {
    // sort user backlog frequencies by genre frequency
    const sortedGenres = Object.entries(this.genreFrequency).sort((a, b) => b[1] - a[1]);

    // pick the top X genres by frequency (set by options)
    const genreSelectionRegular = this._selectGenreFilters({
      genres: sortedGenres, 
      genreDepth: databaseSettings.genreDepth, 
      reverse: false});

    const genreSelectionReverse = this._selectGenreFilters({
      genres: sortedGenres, 
      genreDepth: databaseSettings.genreDepth, 
      reverse: true});
    
    // query IGDB API for top 500 games by popularity with these genres
    // get both regular and reverse selections
    this.results = await getGamesByGenres({
      regular: genreSelectionRegular, 
      reverse: genreSelectionReverse,
      years: databaseSettings.years,
      platforms: (databaseSettings.platforms.length > 0 ? databaseSettings.platforms : this.platforms),
    })

    const regularResults = this.results[0];
    const reverseResults = this.results[1];

    return {regularResults, reverseResults};
  }

  getDbVectors({regularResults, reverseResults}: getDbVectorsParams) {
    const resultsArray = [regularResults.result, reverseResults.result];

    // vectorise all games returned by the API
    resultsArray.forEach(result => {
      result.forEach(game => {
        const vector = this._createDbGameVector(game);
        game.vector = vector;
      })
    })

    return {regularResults, reverseResults};
  }

  getCosineSimilarities(userVector: number[], dbResults: DbGameResult[]) {

    // assign calculated cosine similarity to each IGDB game
    dbResults.forEach(item => {
      const cosineSimilarity = this._cosineSimilarity(userVector, item.vector as number[]);
      item.similarity = cosineSimilarity;
    })
  }
  
  filterResults({results, reverse, filterSettings}: FilterResultsParams) {

    const sliderSum = filterSettings.similarity + filterSettings.rating + filterSettings.popularity;
    const weight = (
      sliderSum === 0 ? 
      {
        similarity: 1/3,
        rating: 1/3,
        popularity: 1/3,
      } : 
      {
        similarity: filterSettings.similarity / sliderSum,
        rating: filterSettings.rating / sliderSum,
        popularity: filterSettings.popularity / sliderSum,
      }
    );

    // obtain min and max values for weighting calculations
    const maxSimilarity = Math.max(...results.map(game => game.similarity ?? 0));
    const minSimilarity = Math.min(...results.map(game => game.similarity ?? 0));
    const maxRating = Math.max(...results.map(game => game.total_rating));
    const minRating = Math.min(...results.map(game => game.total_rating));
    const maxPopularity = Math.max(...results.map(game => game.total_rating_count));
    const minPopularity = Math.min(...results.map(game => game.total_rating_count));

    results.forEach(game => {
      //normalise each metric
      let normalisedSimilarity = this._normalise({
        value: game.similarity ?? 0,
        min: minSimilarity,
        max: maxSimilarity,
      });
      if (reverse) {
        // invert normalised similarity for reverse mode
        normalisedSimilarity = 1 - normalisedSimilarity;
      }
      const normalisedRating = this._normalise({
        value: game.total_rating,
        min: minRating,
        max: maxRating,
      });
      const normalisedPopularity = this._normalise({
        value: game.total_rating_count,
        min: minPopularity,
        max: maxPopularity,
      });

      const overallScore = (
        (normalisedSimilarity * weight.similarity) +
        (normalisedRating * weight.rating) +
        (normalisedPopularity * weight.popularity)
      )

      game.overallScore = overallScore;
    })

    const sortedResults = results.sort((a, b) => (b.overallScore as number) - (a.overallScore as number));
    return sortedResults;
  }

  private async _fetchDetails(statuses: string[]) {
    // filter for game ids that are selected by user
    const filteredGames = this.games.filter(game => statuses.includes(game.status));
    const gameIds = filteredGames.map(game => game.id);
    
    return getBacklogGameInfo(gameIds);
  }

  private _selectGenreFilters({genres, reverse, genreDepth}: SelectGenreFiltersParams) {

    const topGenres = [];
    const frequencyBins: {[category: number]: number[]} = {};

    // loop through all genres and bin them into groups by frequency
    genres.forEach(genre => {
      if (!frequencyBins[genre[1]]) {
        frequencyBins[genre[1]] = [Number(genre[0])];
      } else {
        frequencyBins[genre[1]].push(Number(genre[0]));
      }
    })
    
    // convert object into array to allow sorting
    const frequencyBinsArray = Object.keys(frequencyBins).map(key => {
      return {frequency: Number(key), genres: [...frequencyBins[Number(key)]]};
    })
    
    // sort based on reverse state
    if (!reverse) {
      frequencyBinsArray.sort((a, b) => b.frequency - a.frequency); // highest to lowest
    } else {
      frequencyBinsArray.sort((a, b) => a.frequency - b.frequency); // lowest to highest
    }

    // filter for top X genres (based on genreDepth option)
    let remainingSlots = genreDepth;

    while (remainingSlots > 0) {
      const currentBinValues = frequencyBinsArray[0].genres;
      if (currentBinValues.length === 0) {
        frequencyBinsArray.shift();
      } else {
        if (!reverse && frequencyBinsArray[0].frequency === 0) break; //avoid querying for non-existing genres in backlog for non-reverse
        const index = Math.floor(Math.random() * currentBinValues.length); // pick random index from the bin
        topGenres.push(currentBinValues[index]); // add to genre selected
        currentBinValues.splice(index, 1); // remove value from array
        remainingSlots--;
      }
    }

    console.log(topGenres);
    return(topGenres);
  }

  private _cosineSimilarity(vectorA: number[], vectorB: number[]) {
    
    if (vectorA.length !== vectorB.length) {
      throw new Error('Error: Vector Lengths Must be the Same.');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] ** 2;
      magnitudeB += vectorB[i] ** 2;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }

  private _calculateGenreFrequency(userBacklogInfo: GameDetail[]) {

    const genreFrequency: { [genreId: number]: number} = {};

    userBacklogInfo.forEach(game => {
      game.genres.forEach(genreID => {
        if (genreFrequency[genreID]) {
          genreFrequency[genreID]++;
        } else {
          genreFrequency[genreID] = 1;
        }
      })
    })

    // fill in other genres as zero
    gameGenres.forEach(genre => {
      if (!genreFrequency[Number(genre.id)]) {
        genreFrequency[Number(genre.id)] = 0;
      }
    })

    return genreFrequency;
  }

  private _getPlatforms = (userBacklogInfo: GameDetail[]) => {
    const platforms: string[] = [];

    userBacklogInfo.forEach(game => {
      game.platforms.forEach(platform => {
        if (platforms.includes(platform)) {
          return;
        } else {
          platforms.push(platform);
        }
      })
    })

    return platforms;
  }

  private _normaliseVector(frequencyVector: number[]) {

    const total = frequencyVector.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0)

    // normalise genre frequencies relative to total genres
    return frequencyVector.map(frequency => frequency/total);
  }

  private _createDbGameVector(game: DbGameResult) {
    return gameGenres.map(genre => {
      return game.genres.includes(Number(genre.id)) ? 1: 0;
    })
  }

  private _normalise({value, min, max}: NormaliseParams) {
    if (max === min) return 1;
    return (value - min) / (max - min);
  }

}

export default GameRecommender;