import { useState, useEffect, useRef, createContext } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { GamesFilter } from "../../../types/urlTypes";
import FilterContainer from "./FilterContainer";
import GameContainer from "./GameContainer";

type GamesPageContext = {
  gamesFilter: GamesFilter;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const parseURL = (searchParams: URLSearchParams) => {

  const gamesFilter: GamesFilter = {};

  searchParams.forEach((value, key) => {
    switch (key) {
      case 'search':
        gamesFilter.search = value;
        break;
      case 'sort':
        gamesFilter.sort = value;
        break;
      case 'limit':
        gamesFilter.limit = value;
        break;
      case 'page':
        gamesFilter.page = value;
        break;
      default:
        gamesFilter.where = gamesFilter.where || {};
        gamesFilter.where[key] = value;
    }
  })

  return(gamesFilter);
}

export const GamesPageContext = createContext<GamesPageContext>({
  gamesFilter: {where: {}},
  searchParams: new URLSearchParams,
  setSearchParams: () => {},
});

const GamesPage = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [gamesFilter, setGamesFilter] = useState<GamesFilter>(() => parseURL(searchParams));
  const isInitialLoad = useRef(true);
  
  useEffect((() => {
    
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // mark initial load as completed
      return; // skip the rest of the effect on initial load, avoids duplicate API calls on mount
    }
    
    const newGamesFilter = parseURL(searchParams);
    setGamesFilter(newGamesFilter);
  }), [searchParams])

  console.log(gamesFilter);

  return (
    <GamesPageContext.Provider value={{gamesFilter, searchParams, setSearchParams}}>
      <h2>Filters</h2>
      <FilterContainer />
      <br></br>
      <h2>Game Results</h2>
      <GameContainer />
    </GamesPageContext.Provider>
  )
}

export default GamesPage;