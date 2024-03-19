import { useContext, useState, useEffect } from "react";
import { GamesPageContext } from "./GamesPage";
import GameCoverArray from "../../common/Cover/GameCoverArray";
import getGames from "../../../api/getGames";
import { Game } from "../../../types/gameTypes";

const GameContainer = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<Game[]>();
  const {gamesFilter} = useContext(GamesPageContext);

  useEffect((() => {
    
    const getGamesList = async () => {
      try {
        const gamesData = await getGames(gamesFilter);
        setData(gamesData);
      } catch (error) {
        setError('Failed to fetch game details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getGamesList();
  }), [gamesFilter])

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return <GameCoverArray games={data} />
  }
}

export default GameContainer;