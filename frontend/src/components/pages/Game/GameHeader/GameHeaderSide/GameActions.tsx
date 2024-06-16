import { useState, useContext } from "react";
import { GameDataContext, UserDataContext } from "../../GamePage";
import { Status } from "../../../../../../../shared/types/gameTypes";
import { statuses } from "../../../../../../../shared/objects/filterObjects";
import Dropdown from "../../../../common/Array/Dropdown";

import addGameToBacklog from "../../../../../api/database/addGameToBacklog";
import removeGameFromBacklog from "../../../../../api/database/removeGameFromBacklog";
import changeGameStatus from "../../../../../api/database/changeGameStatus";

const GameActions = () => {
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, setInBacklog, backlogData, setBacklogData} = useContext(UserDataContext);

  const [error, setError] = useState('');
  const [inputsDisabled, setInputsDisabled] = useState(false);

  const userGameData = backlogData || null;

  const addGame = async () => {
    try {
      const response = await addGameToBacklog({username, id: gameData.id})
  
      if (response.ok) {
        console.log('Game added to user backlog.');
        const data = await response.json();
        console.log(data);

        setBacklogData({
          id: gameData.id,
          status: 'notStarted',
          category: null,
          notes: [],
          goals: [],
        });

        setInBacklog(true);
      } else {
        setError('Error Adding Game to Backlog. Please Try Again Later.');
      }
    } catch (error) {
      setError('Error Adding Game to Backlog. Please Try Again Later.')
    } finally {
      setInputsDisabled(false);
    }
  }

  const removeGame = async () => {
    try {
      const response = await removeGameFromBacklog({username, id: gameData.id})
  
      if (response.ok) {
        console.log('Game removed from user backlog.');
        const data = await response.json();
        console.log(data);

        setInBacklog(false);

      } else {
        setError('Error Removing Game From Backlog. Please Try Again Later.');
      }
    } catch (error) {
      setError('Error Removing Game From Backlog. Please Try Again Later.')
    } finally {
      setInputsDisabled(false);
    }
  }

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as Status;
    
    setInputsDisabled(true);
    try {
      const response = await changeGameStatus({username, id: gameData.id, status});

      if (response.ok) {
        console.log('Game Status Changed.');
        const data = await response.json();
        console.log(data);
      } else {
        setError('HTTP Error: Cannot Change Game Status.')
      }
    } catch (error) {
      setError('Error: Cannot Change Game Status.')
    } finally {
      setInputsDisabled(false);
    }
  }
  
  if (error) {
    return <>{error}</>
  }
  
  if (username) {
    return (
      <div>
        <button 
          onClick={() => {
            setInputsDisabled(true);
            if (inBacklog) {
              removeGame();
            } else {
              addGame();
            }
          }}
          disabled={inputsDisabled}
        >
          {inBacklog ? "Remove From Backlog" : "Add To Backlog"}
        </button>
        
        {userGameData && (
        <div>
          <Dropdown options={statuses} handleChange={handleStatusChange} defaultSelection={userGameData ? userGameData.status : 'notStarted'}/>
        </div>
      )}
      </div>
    )
  }
  
  return (
    <>
      Log-in to Add Game To Your Backlog
    </>
  )
}

export default GameActions;