import React, { useContext, useState } from "react"
import { BacklogPageContext } from "./BacklogPage"
import { LoginContext } from "../../../App"
import { BacklogItem } from "../../../../../shared/types/gameTypes"
import CategoriesContainer from "../../common/Categories/CategoriesContainer"
import Dropdown from "../../common/Array/Dropdown"
import { statuses } from "../../../../../shared/objects/filterObjects"
import { Status } from "../../../../../shared/types/gameTypes"
import { useNavigate } from "react-router-dom"
import changeGameStatus from "../../../api/database/changeGameStatus"

type BacklogCardBodyProps = {
  slug: string;
  state: BacklogItem;
}

const statusList = statuses.map(status => status.value);

const BacklogCardBody = ({slug, state}: BacklogCardBodyProps) => {
 
  const {username} = useContext(LoginContext);
  const {setData, setDialogContent, setDialogOpen} = useContext(BacklogPageContext);
  const navigate = useNavigate();

  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [error, setError] = useState('');
  
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as Status;
    
    setInputsDisabled(true);
    try {
      const response = await changeGameStatus({id: state.id, username, status});

      if (response.ok) {
        console.log('Game Status Changed.');
        const data = await response.json();
        console.log(data);

        setData(prevData => {
          const newData = [...prevData];
          const game = newData.find(obj => obj.game.id === state.id);
          if (game && statusList.includes(e.target.value as Status)) {
            game.state.status = e.target.value as Status;
          }
          return newData;
        })
      } else {
        setError('HTTP Error: Cannot Change Game Status.')
      }
    } catch (error) {
      setError('Error: Cannot Change Game Status.')
    } finally {
      setInputsDisabled(false);
    }
  }

  const handleClick = (tab: string) => {
    navigate(`/game/${slug}?tab=${tab}`)
  }

  if (error) {
    return <>{error}</>
  }

  return (
    <>
      <div>
        <div>Status: </div>
        <Dropdown handleChange={handleStatusChange} options={statuses} defaultSelection={state.status} disabled={inputsDisabled}/>
      </div>
      {state.status === 'inProgress' && state.goals.length > 0 ? <div>{`Next Goal: ${state.goals[0].content}`}</div> : ""}
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