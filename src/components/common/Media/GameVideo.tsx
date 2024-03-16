import { useState } from "react";
import { Video } from "../../../api/apiTypes"

type GameVideoProps = {
  video: Video;
}

const GameVideo = ({ video }: GameVideoProps) => {
  
  const [videoClicked, setVideoClicked] = useState(false);
  
  if (!videoClicked) {
    return (
      <img src={`https://img.youtube.com/vi/${video.video_id}/sddefault.jpg`} alt={video.name} onClick={() => setVideoClicked(true)}/>
    )
  }

  return (
    <iframe 
      src={`https://www.youtube.com/embed/${video.video_id}`} 
      width={'640'}
      height={'480'}
      allowFullScreen
      title={video.name}
    /> 
  );
}

export default GameVideo;