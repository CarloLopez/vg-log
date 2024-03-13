import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import GameCover from "../../../../common/GameCover/GameCover";
import GameRatings from "./GameRatings/GameRatings";
import GameActions from "../../../../common/GameActions/GameActions";

const GameHeaderSide = () => {
  
  // obtain gameData from GameDataContext in the GamePage component
  const gameData = useContext(GameDataContext);

  return (
    <div>
      <GameCover coverID={gameData.cover.image_id} size="big" gameName={gameData.name} />
      <GameRatings rating={gameData.total_rating}  rating_count={gameData.total_rating_count} />
      <GameActions />
    </div>
  );
}

export default GameHeaderSide;