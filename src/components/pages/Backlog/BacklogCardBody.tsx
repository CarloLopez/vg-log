import React, { useContext } from "react"
import { BacklogPageContext } from "./BacklogPage"
import { BacklogItemState } from "../../../types/gameTypes"
import CategoriesContainer from "../../common/Categories/CategoriesContainer"
import Dropdown from "../../common/Array/Dropdown"
import { statuses } from "../../../objects/filterObjects"
import { Status } from "../../../types/gameTypes"

type BacklogCardBodyProps = {
  state: BacklogItemState;
}

const statusList = statuses.map(status => status.value);

const BacklogCardBody = ({state}: BacklogCardBodyProps) => {
  const {setData, setDialogContent, setDialogOpen} = useContext(BacklogPageContext);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // TODO: on status change, update database
    setData(prevData => {
      const newData = [...prevData];
      const game = newData.find(obj => obj.game.id === state.id);
      if (game && statusList.includes(e.target.value as Status)) {
        game.state.status = e.target.value as Status;
      }
      return newData;
    })
  }

  return (
    <>
      <div>
        <div>Status: </div>
        <Dropdown handleChange={handleChange} options={statuses} defaultSelection={state.status}/>
      </div>
      {state.status === 'inProgress' && state.nextGoal ? <div>{`Next Goal: ${state.nextGoal}`}</div> : ""}
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