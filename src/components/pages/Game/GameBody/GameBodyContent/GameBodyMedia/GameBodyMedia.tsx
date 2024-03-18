import { useContext } from "react";
import { GameDataContext } from "../../../GamePage";
import GameVideo from "../../../../../common/Media/GameVideo";
import StaticImage from "../../../../../common/Media/StaticImage";

const GameBodyMedia = () => {
  
  const gameData = useContext(GameDataContext);
  
  return (
    <div>
      
      {gameData.screenshots ? (
        <div>
          <h4>Screenshots</h4>
          <div>{gameData.screenshots.map((screenshot) => <StaticImage key={screenshot.id} image={screenshot} size="screenshot_med"/>)}</div>
        </div>
      ) : ""}

      {gameData.videos ? (
        <div>
          <h4>Videos</h4>
          <div>{gameData.videos.map((video) => <GameVideo key={video.id} video={video}/>)}</div>
        </div>
      ) : ""}

      {gameData.artworks ? (
        <div>
          <h4>Artwork</h4>
          <div>{gameData.artworks.map((artwork) => <StaticImage key={artwork.id} image={artwork} size="720p"/>)}</div>
        </div>
      ) : ""}

    </div>
  );
}

export default GameBodyMedia;