import GameCard from "../../common/Cover/GameCard";
import { BacklogItem } from "../../../types/gameTypes";
import BacklogCardBody from "./BacklogCardBody";

type BacklogCardArrayProps = {
  items: BacklogItem[];
}

const BacklogCardArray = ({items}: BacklogCardArrayProps) => {
  return (
    <ul>
      {items.map((item) => {
        return <li key={item.game.id}><GameCard game={item.game}><BacklogCardBody /></GameCard></li>
      })}
    </ul>
  )
}

export default BacklogCardArray;