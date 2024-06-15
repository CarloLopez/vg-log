import { useState, useEffect, useContext } from "react";
import { GameDataContext } from "../../GamePage";
import { User } from "../../../../../types/userTypes";
import { BacklogItem } from "../../../../../../../shared/types/gameTypes";
import checkAuth from "../../../../../api/database/checkAuth";
import getUserData from "../../../../../api/database/getUserData";
import addGameToBacklog from "../../../../../api/database/addGameToBacklog";
import removeGameFromBacklog from "../../../../../api/database/removeGameFromBacklog";

const GameActions = () => {
  const gameData = useContext(GameDataContext);

  const [username, setUsername] = useState('');
  const [userGameData, setUserGameData] = useState<BacklogItem|null>(null);
  const [error, setError] = useState('');
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const addGame = async () => {
    try {
      const response = await addGameToBacklog({username, id: gameData.id})
  
      if (response.ok) {
        console.log('Game added to user backlog.');
        const data = await response.json();
        console.log(data);

        setUserGameData({
          id: gameData.id,
          status: 'notStarted',
          category: null,
          notes: [],
          goals: [],
        });

        setButtonsDisabled(false);
      } else {
        setError('Error Adding Game to Backlog. Please Try Again Later.');
      }
    } catch (error) {
      setError('Error Adding Game to Backlog. Please Try Again Later.')
    }
  }

  const removeGame = async () => {
    try {
      const response = await removeGameFromBacklog({username, id: gameData.id})
  
      if (response.ok) {
        console.log('Game removed from user backlog.');
        const data = await response.json();
        console.log(data);

        setUserGameData(null);

        setButtonsDisabled(false);
      } else {
        setError('Error Removing Game From Backlog. Please Try Again Later.');
      }
    } catch (error) {
      setError('Error Removing Game From Backlog. Please Try Again Later.')
    }
  }

  // check that user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const authName: string = await checkAuth();
        if (authName) {
          setUsername(authName);
          console.log(authName, 'username verified')
        }
      } catch (error) {
        return;
      }
    }

    checkLoggedIn();
  }, [])


  // get user's game information (if applicable), if they are logged in
  useEffect(() => {
    
    const getUserGameData = async () => {
      try {
        const data: User = await getUserData();
        const game = data.backlog.filter(game => game.id === gameData.id);
        
        if (game.length === 1) {
          setUserGameData(game[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (username) {
      getUserGameData();
    }
    
  }, [username])
  
  if (error) {
    return <>{error}</>
  }
  
  if (username) {
    return (
      <div>
        <button 
          onClick={() => {
            setButtonsDisabled(true);
            if (userGameData) {
              removeGame();
            } else {
              addGame();
            }
          }}
          disabled={buttonsDisabled}
        >
          {userGameData ? "Remove From Backlog" : "Add To Backlog"}
        </button>
        
        {userGameData && (
        <div>
          <button>Not Started</button>
          <button>In Progress</button>
          <button>Completed</button>
          <button>Dropped</button>
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