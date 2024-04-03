import { BacklogItemState } from "../../../types/gameTypes"
import { useContext } from "react"
import { BacklogPageContext } from "./BacklogPage"
import CategoriesContainer from "../../common/Categories/CategoriesContainer"

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
  const {setDialogContent, setDialogOpen} = useContext(BacklogPageContext);
  
  return (
    <>
      {`Status: ${state.status}`}
      <Goals></Goals>
      <div>
        <button onClick={() => {
          setDialogContent(<CategoriesContainer />);
          setDialogOpen(true);
        }}>
          Category
        </button>
        <button>Notes</button>
        <button>Goals</button>
      </div>
    </>
  )
}

export default BacklogCardBody;