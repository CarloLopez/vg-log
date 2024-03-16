import { Game } from "../../../api/apiTypes";
import GameCover from "./GameCover";

type GameCoverArrayProps = {
  games: Game[];
}

const GameCoverArray = ({ games }: GameCoverArrayProps) => {
  return (
    <ul>
      {games.map((game) => {
        return <GameCover game={game} size="small" link={game.slug}/>
      })}
    </ul>
  )
}

export default GameCoverArray;