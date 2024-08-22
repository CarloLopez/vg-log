import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import GameCoverArray from "../../../../common/Cover/GameCoverArray";

const GameBodySimilar = () => {
  
  const gameData = useContext(GameDataContext);

  return (
    <>
      {gameData.similar_games ? (
        <div className="flex flex-col justify-center gap-2">
          <h4 className="flex justify-center w-full font-bold">Similar Games</h4>
          <GameCoverArray games={gameData.similar_games} />
        </div>
      ) : "No Similar Games Listed."}
    </>
  );
}

export default GameBodySimilar;