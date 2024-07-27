import { useState, useEffect, useRef, createContext } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { GamesFilter } from "../../../types/urlTypes";
import GameSearch from "./GameSearch";
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
      case 'minRating':
        gamesFilter.minRating = value;
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
      return; // skip effect on initial load, avoids duplicate API calls on mount
    }
    
    const newGamesFilter = parseURL(searchParams);
    setGamesFilter(newGamesFilter);
  }), [searchParams])

  console.log(gamesFilter);

  return (
    <GamesPageContext.Provider value={{gamesFilter, searchParams, setSearchParams}}>
      <div className="flex flex-col gap-2 py-3">
        <div className="flex gap-2 justify-center">
          <h2 className="font-bold">Search</h2>
          <GameSearch />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <FilterContainer />
        </div>
      </div>
      <hr></hr>
      <div className="flex flex-col justify-center items-center gap-3 py-3">
        <h2 className="font-bold ">{'Results' + `${searchParams.get('search') ? (` "${searchParams.get('search')}"`) : ""} `}</h2>
        <GameContainer />
      </div>
      
    </GamesPageContext.Provider>
  )
}

export default GamesPage;