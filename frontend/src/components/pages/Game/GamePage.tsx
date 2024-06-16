import { useEffect, useState, createContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import getGame from "../../../api/getGame";
import GameAPI from "../../../../../shared/types/gameTypes";
import GameHeader from "./GameHeader/GameHeader";
import GameBody from "./GameBody/GameBody";
import { BacklogItem } from "../../../../../shared/types/gameTypes";
import checkAuth from "../../../api/database/checkAuth";
import { User } from "../../../types/userTypes";
import getUserData from "../../../api/database/getUserData";

// create gameData object context for passing down to UI elements, avoid prop drilling
export const GameDataContext = createContext<GameAPI>({
  id: 0,
  cover: {id: 0, image_id: '0'},
  name: 'Template Game',
  summary: 'Template Description',
});

type UserDataContext = {
  username: string;
  inBacklog: boolean;
  setInBacklog: React.Dispatch<React.SetStateAction<boolean>>;
  backlogData: BacklogItem;
  setBacklogData: React.Dispatch<React.SetStateAction<BacklogItem>>;
}

export const UserDataContext = createContext<UserDataContext>({
  username: '',
  inBacklog: false,
  setInBacklog: () => [],
  backlogData: {
    id: 0,
    status: 'notStarted',
    category: null,
    notes: [],
    goals: []
  },
  setBacklogData: () => []
});

const GamePage = () => {

  type UrlParams = {
    gameSlug: string;
  }

  const [gameData, setGameData] = useState<GameAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const [username, setUsername] = useState('');
  const [inBacklog, setInBacklog] = useState(false);
  const [backlogData, setBacklogData] = useState<BacklogItem>({
    id: 0,
    status: 'notStarted',
    category: null,
    notes: [],
    goals: []
  })

  const { gameSlug } = useParams<UrlParams>();

  useEffect(() => {
    // call async function getGame to return JSON response
    if (gameSlug) {

      const getGameDetails = async () => {
        try {
          const data = await getGame(gameSlug);
          setGameData(data[0]);
        } catch (error) {
          setError('Failed to fetch game details. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
  
      getGameDetails();
    }
  }, [gameSlug])

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

  // get user's data from game backlog
  useEffect(() => {
    
    const getUserGameData = async () => {
      try {
        const data: User = await getUserData();
        const game = data.backlog.filter(game => game.id === gameData?.id);
        
        if (game.length === 1) {
          setBacklogData(game[0]);
          setInBacklog(true);
        }
      } catch (error) {
        return;
      }
    }

    if (username && gameData) {
      getUserGameData();
    }
    
  }, [username, gameData])

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }
  
  if (gameData) {
    return (
      <UserDataContext.Provider value={{username, inBacklog, setInBacklog, backlogData, setBacklogData}}>
        <GameDataContext.Provider value={gameData}>
          <GameHeader />
          <hr />
          <GameBody searchParams={searchParams} setSearchParams={setSearchParams}/>
        </GameDataContext.Provider>
      </UserDataContext.Provider>
    );
  } else {
    setError('Game not found.');
  }
}

export default GamePage;