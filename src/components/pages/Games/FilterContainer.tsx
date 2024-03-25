import { gameGenres, gameThemes, gamePlatforms, sortFilters, minRatings } from "../../../objects/filterObjects";
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
    <FilterDropdown options={sortFilters} defaultVal="Relevance" filter="sort" handleDisabled={sortDisabled}/>
    <FilterDropdown options={minRatings} defaultVal="No Min Rating" filter="minRating"/>
    <button onClick={handleButtonClick}>Clear Filters</button>
    </>
  )
}

export default FilterContainer;