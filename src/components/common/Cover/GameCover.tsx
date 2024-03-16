import { Game } from "../../../api/apiTypes";
import { Link } from "react-router-dom";

type GameCoverProps = {
  game: Game;
  size: string;
  link?: string;
}

const GameCover = ({ game, size, link }: GameCoverProps) => {
  const url = `https://images.igdb.com/igdb/image/upload/t_cover_${size}/${game.cover.image_id}.jpg`;
  
  if (link) {
    return <Link to={'/game/' + link}><img src={url} alt={'Cover Image of ' + game.name} /></Link>
  }

  return (
    <img src={url} alt={'Cover Image of ' + game.name} />
  );
}

export default GameCover;