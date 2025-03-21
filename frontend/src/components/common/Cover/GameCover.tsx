import { Game } from "../../../../../shared/types/gameTypes";
import { Link } from "react-router-dom";

type GameCoverProps = {
  game: Game;
  size: string;
  link?: string;
}

const GameCover = ({ game, size, link }: GameCoverProps) => {

  const imageID = game.cover ? game.cover.image_id : 'nocover';
  const url = `https://images.igdb.com/igdb/image/upload/t_cover_${size}/${imageID}.jpg`;
  
  if (link) {
    return <Link to={'/game/' + link} className="shrink-0"><img src={url} alt={'Cover Image of ' + game.name} className="h-full object-contain hover:scale-105"/></Link>
  }

  return (
    <img src={url} alt={'Cover Image of ' + game.name} className="h-full object-contain"/>
  );
}

export default GameCover;