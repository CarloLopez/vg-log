import { BacklogItemState } from "../../../../../shared/types/gameTypes"
import { useNavigate } from "react-router-dom"

type HomeCardBodyProps = {
  slug: string;
  state: BacklogItemState;
}

const HomeCardBody = ({slug, state}: HomeCardBodyProps) => {
  
  const navigate = useNavigate();

  const handleClick = (tab: string) => {
    navigate(`/game/${slug}?tab=${tab}`)
  }

  return (
    <>
      {state.nextGoal ? <div>{`Next Goal: ${state.nextGoal}`}</div> : ""}
      <div>
        <button onClick={() => handleClick('notes')}>Notes</button>
        <button onClick={() => handleClick('goals')}>Goals</button>
      </div>
    </>
  )
}

export default HomeCardBody;