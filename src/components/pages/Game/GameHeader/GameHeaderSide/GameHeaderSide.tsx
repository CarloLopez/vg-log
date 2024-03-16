import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import GameCover from "../../../../common/Cover/GameCover";
import GameRatings from "./GameRatings/GameRatings";
import GameActions from "../../../../common/Actions/GameActions";

const GameHeaderSide = () => {
  
  // obtain gameData from GameDataContext in the GamePage component
  const gameData = useContext(GameDataContext);

  const game = {
    id: gameData.id,
    cover: gameData.cover,
    name: gameData.name,
  }

  return (
    <div>
      <GameCover game={game} size="big" />
      <GameRatings rating={gameData.total_rating}  rating_count={gameData.total_rating_count} />
      <GameActions />
    </div>
  );
}

export default GameHeaderSide;