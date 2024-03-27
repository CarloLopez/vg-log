import { ReactNode } from "react";
import { Game } from "../../../types/gameTypes";
import GameCover from "./GameCover";

type GameCardProps = {
  game: Game;
  children: ReactNode;
}

const GameCard = ({game, children}: GameCardProps) => {
  return (
    <>
      <GameCover game={game} size="med"/>
      <div>
        <h2>{game.name}</h2>
        {children}
      </div>
    </>
  )
}

export default GameCard;