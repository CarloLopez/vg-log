import { BacklogItemState } from "../types/gameTypes";
import { Status } from "../types/gameTypes";
import syntheticData from "../../../backend/temp/syntheticData.json";
import { cosineSimilarity } from "./cosineSimilarity";
import getBacklog from "../api/getBacklog";

type syntheticBacklogItem = {
  id: number;
  status: Status;
  name: string;
}

export class CollaborativeGameRecommender {
  private userGames: BacklogItemState[];
  private userGameIds: number[];
  private userVector: number[];
  private syntheticUsers: {id: number, vector: number[], similarity:number, backlog: syntheticBacklogItem[]}[];

  constructor(userGames: BacklogItemState[] = []) {
    this.userGames = userGames;
    this.userGameIds = userGames.map(game => game.id);
    this.userVector = this._createUserVector();
    this.syntheticUsers = this._createSyntheticUsers();
  }

  async getCollaborativeRecommendation() {
    if (!this.userVector.includes(0.5) || !this.userVector.includes(0.75)) {
      throw new Error('Backlog Picker Error: No In-Progress or Not Started Games to Recommend')
    }
    let sortedUsers = this.syntheticUsers.sort((a, b) => b.similarity - a.similarity);

    /*
      since we are using this to recommend games already in the backlog, avoid similarity of 1
      as cosine 1 means games (and statuses) are the exact same, so no recommendations possible.
      also avoid 0 because no games match, so cannot recommend anything.
    */
    sortedUsers = sortedUsers.filter(user => user.similarity > 0 && user.similarity < 1);

    // we want to recommend the user an unfinished game in their backlog that another user has completed
    const unfinishedGames = this.userGames.map(game => {
      if (game.status === 'inProgress' || game.status === 'notStarted') {
        return game.id;
      }
    })

    // loop through all synthetic users to see if any can recommend a completed game
    let gameIdSelected = undefined;
    for (let i = 0; i < sortedUsers.length; i++) {
      const user = sortedUsers[i];
      const choices: number[] = [];
      
      unfinishedGames.forEach(gameId => {
        const foundGame = user.backlog.find(game => game.id === gameId && game.status === 'completed');
        if (foundGame) {
          choices.push(foundGame.id);
        }
      })

      // return a game if a match was found
      if (choices.length > 0) {
        gameIdSelected = choices[Math.floor(Math.random() * choices.length)];
        break;
      }
    }

    if (gameIdSelected) {
      return await getBacklog([gameIdSelected]);
    } else {
      return [];
    }
    
  }

  private _createUserVector() {
    return this.userGames.map(game => this._checkStatus(game.status));
  }

  private _createSyntheticUsers() {
    return syntheticData.map(user => {

      const vector = this._createSyntheticVector(user.backlog as syntheticBacklogItem[]);
      const similarity = cosineSimilarity(this.userVector, vector);

      return {
        id: user.user_id,
        vector,
        similarity,
        backlog: user.backlog as syntheticBacklogItem[],
      }
    })
  }

  private _createSyntheticVector(backlog: syntheticBacklogItem[]) {
    const gameIds = backlog.map(game => game.id);
    
    // loop through all user game ids and return a value if the synthetic user has it in their backlog
    const vector = this.userGameIds.map(id => {
      if (gameIds.includes(id)) {
        const game = backlog.find(game => game.id === id) as syntheticBacklogItem;
        return this._checkStatus(game.status);
      } else {
        return 0;
      }
    })

    return vector;
  }

  // weighted vector value based on game status in backlog
  private _checkStatus(status: Status) {
    switch(status) {
      case "completed":
        return 1;
      case "inProgress":
        return 0.75;
      case "notStarted":
        return 0.5;
      case "dropped":
        return 0.25;
      default:
        throw new Error('Game Missing Status.')
    }
  }
}

