import React, { useContext, useState, useEffect } from "react"
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
  gameName: string;
  gameId: number;
  slug: string;
  state: BacklogItem;
}

const statusList = statuses.map(status => status.value);

const BacklogCardBody = ({gameName, gameId, slug, state}: BacklogCardBodyProps) => {
 
  const {username} = useContext(LoginContext);
  const {setData, setDialogContent, setDialogOpen} = useContext(BacklogPageContext);
  const navigate = useNavigate();

  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [error, setError] = useState('');

  const [nextGoal, setNextGoal] = useState('');

  useEffect(() => {
    if (state.goals.length > 0) {
      for (let i = 0; i < state.goals.length; i++) {
        if (!state.goals[i].completed) {
          setNextGoal(state.goals[i].content);
          break;
        }
      }
    }
  }, [])
  
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
    navigate(`/game/${slug}?tab=${tab}`);
  }

  const statusColour = () => {
    switch (state.status) {
      case 'completed':
        return '#10B981';
      case 'dropped':
        return '#EF4444';
      case 'inProgress':
        return '#F97316';
      case 'notStarted':
        return '#64748B';
      default:
        return '#000000';
    }
  };

  if (error) {
    return <>{error}</>
  }

  return (
    <div className="flex flex-col justify-between h-full py-2">
      <div className="flex flex-col flex-grow">
        <div style={{color: statusColour()}} className="font-bold text-xl overflow-auto max-h-12">
          {gameName}
        </div>
        <div className="flex gap-2">
          <Dropdown handleChange={handleStatusChange} options={statuses} defaultSelection={state.status} disabled={inputsDisabled}/>
        </div>
        {state.status === 'inProgress' && nextGoal ? <div className="flex-grow break-all overflow-auto max-h-16 italic">{`Next Goal: ${nextGoal}`}</div> : ""}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => {
            setDialogContent(<CategoriesContainer gameId={gameId} setDialogOpen={setDialogOpen}/>);
            setDialogOpen(true);
          }}
          className="bg-slate-800 px-2 rounded hover:scale-105"
        >
          Category
        </button>
        {state.status === 'inProgress' ? <button onClick={() => handleClick('notes')} className="bg-slate-800 px-2 rounded hover:scale-105">Notes</button> : ''}
        {state.status === 'inProgress' ? <button onClick={() => handleClick('goals')} className="bg-slate-800 px-2 rounded hover:scale-105">Goals</button> : ''}
      </div>
    </div>
  )
}

export default BacklogCardBody;