import { Game } from "../../../../../shared/types/gameTypes";
import GameCover from "./GameCover";

type GameCoverArrayProps = {
  games: Game[];
}

const GameCoverArray = ({ games }: GameCoverArrayProps) => {
  return (
    <ul className="flex gap-3 flex-wrap justify-center">
      {games.map((game) => {
        return <GameCover key={game.id} game={game} size="small_2x" link={game.slug}/>
      })}
    </ul>
  )
}

export default GameCoverArray;