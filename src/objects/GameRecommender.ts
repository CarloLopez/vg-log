import { BacklogItemState } from "../types/gameTypes";
import { gameGenres } from "./filterObjects";
import getBacklogGameInfo from "../api/recommender/getBacklogGameInfo";
import getGamesByGenres from "../api/recommender/getGamesByGenres";
import { Image } from "../types/gameTypes";

export type Options = {
  genreDepth: number;
  platforms: number[];
}

type GameGenre = {
  id: number;
  genres: number[];
}

export type DbGameResult = {
  id: number;
  name: string;
  slug: string;
  cover: Image;
  total_rating_count: number;
  genres: number[];
  vector?: number[];
  similarity?: number;
}

type APIResult = {
  name: string;
  result: DbGameResult[];
}

export type getDbVectorsParams = {
  regularResults: APIResult;
  reverseResults: APIResult;
}

class GameRecommender {

  options: Options;

  private games: BacklogItemState[];
  private results: APIResult[];
  genreFrequency: { [genreId: number]: number};

  constructor(games: BacklogItemState[] = []) {
    this.options = {
      genreDepth: 3,
      platforms: [],
    }
    this.games = games;
    this.results = [];
    this.genreFrequency = {};
  }

  async getBacklogInfo() {
    const backlogInfo = await this._fetchGenres();

    // tally genre ids for games in the backlog
    this.genreFrequency = this._calculateGenreFrequency(backlogInfo);
  }

  calculateUserVector() {

    //TODO: CHANGE VECTOR BASED ON USER OPTIONS

    // create vector for similarity analysis based on the frequencies
    const filledVector = gameGenres.map(genre => this.genreFrequency[Number(genre.id)]);

    // normalise vector to avoid overweighting high frequency games
    return this._normaliseVector(filledVector);
  }

  async getDbGames() {
    // sort user backlog frequencies by genre frequency
    const sortedGenres = Object.entries(this.genreFrequency).sort((a, b) => b[1] - a[1]);

    // pick the top X genres by frequency (set by options)
    const genreSelectionRegular = this._selectGenreFilters(sortedGenres);
    const genreSelectionReverse = this._selectGenreFilters(sortedGenres, true);
    
    // query IGDB API for top 500 games by popularity with these genres
    // get both regular and reverse selections
    this.results = await getGamesByGenres({
      regular: genreSelectionRegular, 
      reverse: genreSelectionReverse,
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

    return dbResults;
  }

  private _selectGenreFilters(genres: [string, number][], reverse: boolean = false) {

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
    let remainingSlots = this.options.genreDepth;

    while (remainingSlots > 0) {
      const currentBinValues = frequencyBinsArray[0].genres;
      if (currentBinValues.length === 0) {
        frequencyBinsArray.shift();
      } else {
        const index = Math.floor(Math.random() * currentBinValues.length); // pick random index from the bin
        topGenres.push(currentBinValues[index]); // add to genre selected
        currentBinValues.splice(index, 1); // remove value from array
        remainingSlots--;
      }
    }

    return(topGenres);
  }
  
  filterResults(results: DbGameResult[], reverse: boolean = false) {

    // TODO: LET USER DETERMINE SIMILARITY VS POPULARITY RATIO

    let sortedResults: DbGameResult[] = [];

    if (!reverse) {
      sortedResults = results.sort((a, b) => (b.similarity as number) - (a.similarity as number));
    } else {
      /* 
      if reverse is set (least played genres), sort by similarity >= 0.5 or not
      reasoning: popularity more important than absolute similarity here, as reverse genres is naturally less similar. We want to recommend popular games since they are more likely to be received well, hence 0.5 is a threshold to recommend popular games that arent too similar 
      */
      
      results.sort((a, b) => (b.total_rating_count) - (a.total_rating_count));

      const similar: DbGameResult[] = [];
      const notSimilar: DbGameResult[] = [];

      results.forEach(game => {
        if (game.similarity && game.similarity >= 0.5) {
          similar.push(game);
        } else {
          notSimilar.push(game);
        }
      })
      
      sortedResults = notSimilar.concat(similar);
    }
    
    return sortedResults;

    // TODO: FURTHER FILTERING BASED ON USER OPTIONS
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

  private async _fetchGenres() {
    // filter for game ids that are not dropped (since dropped games = user dislike)
    const filteredGames = this.games.filter(game => game.status !== "dropped");
    const gameIds = filteredGames.map(game => game.id);
    return getBacklogGameInfo(gameIds);
  }

  private _calculateGenreFrequency(userGameGenres: GameGenre[]) {

    const genreFrequency: { [genreId: number]: number} = {};

    userGameGenres.forEach(game => {
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

}

export default GameRecommender;