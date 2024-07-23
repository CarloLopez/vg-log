import HomeCard from "./HomeCard";
import HomeCardBody from "./HomeCardBody";
import { BacklogCardItem } from "../../../../../shared/types/gameTypes";

type HomeCardArrayProps = {
  data: BacklogCardItem[];
}

const HomeCardArray = ({data}: HomeCardArrayProps) => {
  
  const inProgressGames = data.filter(item => item.state.status === 'inProgress');

  return (
    <ul className="flex gap-4 flex-wrap justify-center">
      {inProgressGames.map((item) => {
        return <li key={item.game.id}>
          <HomeCard game={item.game}>
            <HomeCardBody slug={item.game.slug || ""} state={item.state}/>
          </HomeCard>
        </li>
      })}
    </ul>
  )
}

export default HomeCardArray;