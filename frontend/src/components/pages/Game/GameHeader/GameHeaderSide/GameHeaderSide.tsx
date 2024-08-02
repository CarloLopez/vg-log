import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import GameCover from "../../../../common/Cover/GameCover";
import GameRatings from "./GameRatings";
import GameActions from "./GameActions";

const GameHeaderSide = () => {
  
  // obtain gameData from GameDataContext in the GamePage component
  const gameData = useContext(GameDataContext);

  const game = {
    id: gameData.id,
    cover: gameData.cover,
    name: gameData.name,
  }

  return (
    <div className="flex flex-col flex-shrink-0 items-center w-full md:w-auto">
      <GameCover game={game} size="small_2x" />
      <GameRatings rating={gameData.total_rating} rating_count={gameData.total_rating_count} />
      <GameActions />
    </div>
  );
}

export default GameHeaderSide;