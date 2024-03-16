import { useContext } from "react";
import { GameDataContext } from "../../../GamePage";
import GameCoverArray from "../../../../../common/Cover/GameCoverArray";

const GameBodySimilar = () => {
  
  const gameData = useContext(GameDataContext);

  // TODO: Implement the reccommender model here because IGDB reccommender isn't good.

  return (
    <>
      {gameData.similar_games ? (
        <>
          <h4>Similar Games</h4>
          <GameCoverArray games={gameData.similar_games} />
        </>
      ) : "No Similar Games Listed."}
    </>
  );
}

export default GameBodySimilar;