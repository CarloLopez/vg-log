import { Game } from "../../../types/gameTypes";
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
    return <Link to={'/game/' + link}><img src={url} alt={'Cover Image of ' + game.name} /></Link>
  }

  return (
    <img src={url} alt={'Cover Image of ' + game.name} />
  );
}

export default GameCover;