import { useContext } from "react";
import { GameDataContext } from "../../GamePage";
import GameVideo from "../../../../common/Media/GameVideo";
import StaticImage from "../../../../common/Media/StaticImage";

const GameBodyMedia = () => {
  
  const gameData = useContext(GameDataContext);
  
  return (
    <div className="flex flex-col gap-3">
      
      {gameData.screenshots ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-bold flex justify-center">Screenshots</h4>
          <div className="flex gap-2 flex-wrap justify-center">{gameData.screenshots.map((screenshot) => <StaticImage key={screenshot.id} image={screenshot} size="screenshot_med"/>)}</div>
        </div>
      ) : ""}

      {gameData.videos ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-bold flex justify-center">Videos</h4>
          <div className="flex gap-2 flex-wrap justify-center">{gameData.videos.map((video) => <GameVideo key={video.id} video={video}/>)}</div>
        </div>
      ) : ""}

      {gameData.artworks ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-bold flex justify-center">Artwork</h4>
          <div className="flex gap-2 flex-wrap justify-center">{gameData.artworks.map((artwork) => <StaticImage key={artwork.id} image={artwork} size="720p"/>)}</div>
        </div>
      ) : ""}

    </div>
  );
}

export default GameBodyMedia;