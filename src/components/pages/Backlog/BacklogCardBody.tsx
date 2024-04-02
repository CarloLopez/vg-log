import { BacklogItemState } from "../../../types/gameTypes"

const Goals = () => {
  return (
    <ul>
      <div>
        <input type="checkbox" />
        <div>Goal 1</div>
      </div>
      <div>
        <input type="checkbox" />
        <div>Goal 2</div>
      </div>
    </ul>
  )
}

type BacklogCardBodyProps = {
  state: BacklogItemState;
}

const BacklogCardBody = ({state}: BacklogCardBodyProps) => {
  return (
    <>
      {`Status: ${state.status}`}
      <Goals></Goals>
      <div>
        <button>Category</button>
        <button>Notes</button>
        <button>Goals</button>
      </div>
    </>
  )
}

export default BacklogCardBody;