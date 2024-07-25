import GameCard from "../../common/Cover/GameCard";
import { BacklogCardItem } from "../../../../../shared/types/gameTypes";
import BacklogCardBody from "./BacklogCardBody";

type BacklogCardArrayProps = {
  items: BacklogCardItem[];
}

const BacklogCardArray = ({items}: BacklogCardArrayProps) => {
  return (
    <ul className="flex flex-col flex-grow-0 max-w-2xl w-full gap-2 py-3">
      {items.map((item) => {
        return <li 
          key={item.game.id}
          className="flex gap-2 w-full h-48 bg-gray-600 p-2"
        >
          <GameCard game={item.game}>
            <BacklogCardBody gameName={item.game.name} gameId={item.game.id} slug={item.game.slug || ""} state={item.state}/>
          </GameCard>
        </li>
      })}
    </ul>
  )
}

export default BacklogCardArray;