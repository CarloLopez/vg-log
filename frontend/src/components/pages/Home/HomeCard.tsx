import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Game } from "../../../../../shared/types/gameTypes";
import GameCover from "../../common/Cover/GameCover";

type HomeCardProps = {
  game: Game;
  children: ReactNode;
}

const HomeCard = ({game, children}: HomeCardProps) => {
  return (
    <div className="flex gap-3 bg-gray-600 p-3 items-center w-80 h-40 md:w-96">
      <div className="h-full flex-shrink-0">
        <GameCover game={game} size="med" link={game.slug}/>
      </div>
      <div className="flex flex-col gap-2">
        <Link to={'/game/' + game.slug} className="font-bold text-2xl overflow-auto max-h-20 max-w-full">{game.name}</Link>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default HomeCard;