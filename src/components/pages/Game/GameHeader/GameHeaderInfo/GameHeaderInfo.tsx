import moment from "moment";
import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import NameButtonArray from "../../../../common/ButtonArray/NameButtonArray";
import PlatformButtonArray from "../../../../common/ButtonArray/PlatformButtonArray";

const GameHeaderInfo = () => {
  
  const gameData = useContext(GameDataContext)
  let date = "";

  if (gameData.first_release_date) {
    // format unix date into human-readable string
    date = moment.unix(gameData.first_release_date).format('Do MMMM YYYY');
  }
  
  return (
    <div>
      <h1>{gameData.name}</h1>

      <div>{date || 'Release Date TBA'}</div>

      <div>
        <h4>Summary</h4>
        <div>{gameData.summary}</div>
      </div>

      <div>
        <h4>Genres</h4>
        <ul>
          {gameData.genres && <NameButtonArray items={gameData.genres} />}
        </ul>
      </div>

      <div>
        <h4>Platforms</h4>
        <ul>
          {gameData.platforms && <PlatformButtonArray items={gameData.platforms} />}
        </ul>
      </div>
      
    </div>
  );
}

export default GameHeaderInfo;