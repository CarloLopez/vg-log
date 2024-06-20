import GameCard from "../../common/Cover/GameCard";
import { BacklogCardItem } from "../../../../../shared/types/gameTypes";
import BacklogCardBody from "./BacklogCardBody";

type BacklogCardArrayProps = {
  items: BacklogCardItem[];
}

const BacklogCardArray = ({items}: BacklogCardArrayProps) => {
  return (
    <ul>
      {items.map((item) => {
        return <li key={item.game.id}><GameCard game={item.game}><BacklogCardBody gameId={item.game.id} slug={item.game.slug || ""} state={item.state}/></GameCard></li>
      })}
    </ul>
  )
}

export default BacklogCardArray;