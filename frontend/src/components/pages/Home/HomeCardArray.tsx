import GameCard from "../../common/Cover/GameCard";
import HomeCardBody from "./HomeCardBody";
import { BacklogItem } from "../../../../../shared/types/gameTypes";

type HomeCardArrayProps = {
  data: BacklogItem[];
}

const HomeCardArray = ({data}: HomeCardArrayProps) => {
  
  const inProgressGames = data.filter(item => item.state.status === 'inProgress');

  return (
    <ul>
      {inProgressGames.map((item) => {
        return <li key={item.game.id}><GameCard game={item.game}><HomeCardBody slug={item.game.slug || ""} state={item.state}/></GameCard></li>
      })}
    </ul>
  )
}

export default HomeCardArray;