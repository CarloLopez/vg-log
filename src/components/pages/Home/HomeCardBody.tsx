import { BacklogItemState } from "../../../types/gameTypes"

type HomeCardBodyProps = {
  state: BacklogItemState;
}

const HomeCardBody = ({state}: HomeCardBodyProps) => {
  
  return (
    <>
      {state.nextGoal ? <div>{`Next Goal: ${state.nextGoal}`}</div> : ""}
      <div>
        <button>Notes</button>
        <button>Goals</button>
      </div>
    </>
  )
}

export default HomeCardBody;