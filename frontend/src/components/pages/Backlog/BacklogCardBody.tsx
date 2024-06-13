import React, { useContext } from "react"
import { BacklogPageContext } from "./BacklogPage"
import { BacklogItemState } from "../../../../../shared/types/gameTypes"
import CategoriesContainer from "../../common/Categories/CategoriesContainer"
import Dropdown from "../../common/Array/Dropdown"
import { statuses } from "../../../../../shared/objects/filterObjects"
import { Status } from "../../../../../shared/types/gameTypes"
import { useNavigate } from "react-router-dom"

type BacklogCardBodyProps = {
  slug: string;
  state: BacklogItemState;
}

const statusList = statuses.map(status => status.value);

const BacklogCardBody = ({slug, state}: BacklogCardBodyProps) => {
  const {setData, setDialogContent, setDialogOpen} = useContext(BacklogPageContext);
  const navigate = useNavigate();
  
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

  const handleClick = (tab: string) => {
    navigate(`/game/${slug}?tab=${tab}`)
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
        <button onClick={() => handleClick('notes')}>Notes</button>
        <button onClick={() => handleClick('goals')}>Goals</button>
      </div>
    </>
  )
}

export default BacklogCardBody;