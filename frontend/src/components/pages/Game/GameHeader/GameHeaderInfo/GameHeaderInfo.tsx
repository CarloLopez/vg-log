import moment from "moment";
import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import LinkArray from "../../../../common/Array/LinkArray";
import GameHeaderPlatforms from "./GameHeaderPlatforms";

const GameHeaderInfo = () => {
  
  const gameData = useContext(GameDataContext)
  let date = "";

  if (gameData.first_release_date) {
    // format unix date into human-readable string
    date = moment.unix(gameData.first_release_date).format('Do MMMM YYYY');
  }
  
  return (
    <div className="flex flex-col justify-center gap-2 ">
      <h1 className="font-bold text-4xl">{gameData.name}</h1>

      <div className="italic text-lg">{date || 'Release Date TBA'}</div>

      <div>
        <h4 className="font-bold">Summary</h4>
        <div>{gameData.summary}</div>
      </div>

      <div>
        <h4 className="font-bold">Genres</h4>
        <ul>
          {gameData.genres && <LinkArray items={gameData.genres} />}
        </ul>
      </div>

      <div>
        <h4 className="font-bold">Platforms</h4>
        <ul>
          {gameData.platforms && <GameHeaderPlatforms items={gameData.platforms} />}
        </ul>
      </div>
      
    </div>
  );
}

export default GameHeaderInfo;