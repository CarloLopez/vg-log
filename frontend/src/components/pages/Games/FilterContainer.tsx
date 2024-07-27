import { gameGenres, gameThemes, gamePlatforms, sortFilters, minRatings } from "../../../../../shared/objects/filterObjects";
import { useState, useContext } from "react";
import { GamesPageContext } from "./GamesPage";
import FilterButtonArray from "./FilterButtonArray";
import FilterDropdown from "./FilterDropdown";

const FilterContainer = () => {

  const {searchParams, setSearchParams} = useContext(GamesPageContext)

  const [showFilters, setShowFilters] = useState(false);

  // clear all filters other than dropdowns and search string
  const handleButtonClick = () => {
    const whiteList = ['search', 'sort', 'minRating'];
    const newSearchParams = new URLSearchParams();
    
    whiteList.forEach((filter) => {
      const value = searchParams.get(filter);
      if (value) {
        newSearchParams.set(filter, value);
      }
    })
    setSearchParams(newSearchParams);
  }

  const sortDisabled = () => {
    if (searchParams.get('search')) {
      return true;
    }
    return false;
  }

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => {setShowFilters(current => !current)}}
          className="bg-slate-800 rounded max-w-28 px-2"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      
      {
        showFilters ? (
          <div className="flex flex-col gap-2 py-3">
            <FilterButtonArray filterName="genres" filters={gameGenres} replace={false}/>
            <FilterButtonArray filterName="themes" filters={gameThemes} replace={false}/>
            <FilterButtonArray filterName="platforms" filters={gamePlatforms} replace={true}/>
            <div className="flex justify-center">
              <button onClick={handleButtonClick} className="bg-slate-400 text-black rounded px-2 py-2 max-w-28 hover:bg-red-700">Clear Filters</button>
            </div>
          </div>
        ) : ""
      }
      
      <div className="flex justify-center flex-wrap gap-1">
        <div className="flex gap-2">
          <label htmlFor="sort">Sort By</label>
          <FilterDropdown options={sortFilters} defaultVal="Relevance" filter="sort" handleDisabled={sortDisabled}/>
        </div>
        <div className="flex gap-2">
          <label htmlFor="minRating">Minimum Rating</label>
          <FilterDropdown options={minRatings} defaultVal="--" filter="minRating"/>
        </div>
      </div>
    </>
  )
}

export default FilterContainer;