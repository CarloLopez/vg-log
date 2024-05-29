import { useEffect, useState, createContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import getGame from "../../../api/getGame";
import GameAPI from "../../../types/gameTypes";
import GameHeader from "./GameHeader/GameHeader";
import GameBody from "./GameBody/GameBody";

// create gameData object context for passing down to UI elements, avoid prop drilling
export const GameDataContext = createContext<GameAPI>({
  id: 0,
  cover: {id: 0, image_id: '0'},
  name: 'Template Game',
  summary: 'Template Description',
});

const GamePage = () => {

  type UrlParams = {
    gameSlug: string;
  }

  const [gameData, setGameData] = useState<GameAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

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

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }
  
  if (gameData) {
    return (
      <GameDataContext.Provider value={gameData}>
        <GameHeader />
        <hr />
        <GameBody searchParams={searchParams} setSearchParams={setSearchParams}/>
      </GameDataContext.Provider>
    );
  } else {
    setError('Game not found.');
  }
}

export default GamePage;