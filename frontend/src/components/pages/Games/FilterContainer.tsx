import { gameGenres, gameThemes, gamePlatforms, sortFilters, minRatings } from "../../../../../backend/temp/filterObjects";
import { useContext } from "react";
import { GamesPageContext } from "./GamesPage";
import FilterButtonArray from "./FilterButtonArray";
import FilterDropdown from "./FilterDropdown";

const FilterContainer = () => {

  const {searchParams, setSearchParams} = useContext(GamesPageContext)

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
    <FilterButtonArray filterName="genres" filters={gameGenres} replace={false}/>
    <FilterButtonArray filterName="themes" filters={gameThemes} replace={false}/>
    <FilterButtonArray filterName="platforms" filters={gamePlatforms} replace={true}/>
    <label htmlFor="sort">Sort By</label>
    <FilterDropdown options={sortFilters} defaultVal="Relevance" filter="sort" handleDisabled={sortDisabled}/>
    <label htmlFor="minRating">Minimum Rating</label>
    <FilterDropdown options={minRatings} defaultVal="--" filter="minRating"/>
    <button onClick={handleButtonClick}>Clear Filters</button>
    </>
  )
}

export default FilterContainer;