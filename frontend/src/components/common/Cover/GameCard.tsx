import { ReactNode } from "react";
import { Game } from "../../../../../shared/types/gameTypes";
import GameCover from "./GameCover";

type GameCardProps = {
  game: Game;
  children: ReactNode;
}

const GameCard = ({game, children}: GameCardProps) => {
  return (
    <>
      <GameCover game={game} size="med" link={game.slug}/>
      <div>
        {children}
      </div>
    </>
  )
}

export default GameCard;