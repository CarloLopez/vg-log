import { BacklogItemState } from "../types/gameTypes";
import { gameGenres } from "./filterObjects";
import getGameGenres from "../api/recommender/getGameGenres";
import getGamesByGenres from "../api/recommender/getGamesByGenres";
import { Image } from "../types/gameTypes";

type GameGenre = {
  id: number;
  genres: number[];
}

type DbGameResult = {
  id: number;
  name: string;
  slug: string;
  cover: Image;
  genres: number[];
  vector?: number[];
  similarity?: number;
}

class GameRecommender {
  private games: BacklogItemState[];
  private results: DbGameResult[];
  private genreFrequency: { [genreId: number]: number};
  private options: {
    sortCap: number;
  }

  constructor(games: BacklogItemState[] = []) {
    this.games = games;
    this.results = [];
    this.genreFrequency = {};
    this.options = {
      sortCap: 3,
    }
  }

  async getUserVector() {
    const userGenres = await this._fetchGenres();

    // tally genre ids for games in the backlog
    this.genreFrequency = this._calculateGenreFrequency(userGenres);
    
    // create comparable vector for similarity analysis based on the frequencies (fill in blanks with zeros)
    const filledVector = gameGenres.map(genre => this.genreFrequency[Number(genre.id)] || 0);

    // normalise vector to avoid overweighting high frequency games
    return this._normaliseVector(filledVector);
  }

  async getDbVectors() {
    // sort user backlog frequencies by genre frequency
    const sortedGenres = Object.entries(this.genreFrequency).sort((a, b) => b[1] - a[1]);

    // pick the top X genres by frequency (set by options)
    const topGenres = sortedGenres.slice(0, this.options.sortCap).map(genre => Number(genre[0]));
    
    // query IGDB API for top 500 games by popularity with these genres
    this.results = await getGamesByGenres(topGenres);

    // vectorise all games returned by the API
    this.results.forEach(game => {
      const vector = this._createDbGameVector(game);
      game.vector = vector;
    })

    return this.results;
  }

  getCosineSimilarities(userVector: number[], dbResults: DbGameResult[]) {

    // assign calculated cosine similarity to each IGDB game
    dbResults.forEach(item => {
      const cosineSimilarity = this._cosineSimilarity(userVector, item.vector as number[]);
      item.similarity = cosineSimilarity;
    })

    return this.results.sort((a, b) => b.similarity - a.similarity);
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
    return getGameGenres(gameIds);
  }

  private _calculateGenreFrequency(gameGenres: GameGenre[]) {

    const genreFrequency: { [genreId: number]: number} = {};

    gameGenres.forEach(game => {
      game.genres.forEach(genreID => {
        if (genreFrequency[genreID]) {
          genreFrequency[genreID]++;
        } else {
          genreFrequency[genreID] = 1;
        }
      })
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