import { BacklogItem } from "../../../../../shared/types/gameTypes"
import { useNavigate } from "react-router-dom"

type HomeCardBodyProps = {
  slug: string;
  state: BacklogItem;
}

const HomeCardBody = ({slug, state}: HomeCardBodyProps) => {
  
  const navigate = useNavigate();

  const handleClick = (tab: string) => {
    navigate(`/game/${slug}?tab=${tab}`)
  }

  return (
    <>
      {state.goals.length > 0 ? <div>{`Next Goal: ${state.goals[0].content}`}</div> : ""}
      <div>
        <button onClick={() => handleClick('notes')}>Notes</button>
        <button onClick={() => handleClick('goals')}>Goals</button>
      </div>
    </>
  )
}

export default HomeCardBody;