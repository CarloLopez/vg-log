import { useContext, useState, useEffect } from "react";
import { GamesPageContext } from "./GamesPage";
import GameCoverArray from "../../common/Cover/GameCoverArray";
import getGames from "../../../api/getGames";
import { Game } from "../../../types/gameTypes";

const GameContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allData, setAllData] = useState<Game[]>([]); // 500 games retrieved from API request
  const [displayedData, setDisplayedData] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(50); // number of games to display at a time
  const { gamesFilter } = useContext(GamesPageContext);

  useEffect(() => {
    const getGamesList = async () => {
      setLoading(true);
      try {
        const gamesData = await getGames(gamesFilter);
        setAllData(gamesData);
        setDisplayedData(gamesData.slice(0, pageSize)); // display first page of games on first load
        setCurrentPage(0);
      } catch (error) {
        setError('Failed to fetch game details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getGamesList();
  }, [gamesFilter, pageSize]);

  useEffect(() => {
    const loadMoreGames = () => {
      const nextPage = currentPage + 1;
      // slice the next set of 50 games to display next
      const nextSetOfGames = allData.slice(nextPage * pageSize, (nextPage + 1) * pageSize);
      
      // displayed data is now original displayed data + the next set of games
      setDisplayedData(prev => [...prev, ...nextSetOfGames]);
      setCurrentPage(nextPage);
    };
    
    const handleScroll = () => {
      // below calculation checks if viewport height + pixels that user scrolled is not equal to whole document pixels (i.e., all loaded items)
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
      loadMoreGames(); // only load more games if user has scrolled to the bottom of the page
    };

    window.addEventListener('scroll', handleScroll); // call handleScroll every time user scrolls
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, currentPage, pageSize, allData.length, allData]);

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  return <GameCoverArray games={displayedData} />;
};

export default GameContainer;