import { gameGenres, gameThemes, gamePlatforms, sortFilters, minRatings } from "../../../objects/filterObjects";
import { useContext } from "react";
import { GamesPageContext } from "./GamesPage";
import FilterButtonArray from "./FilterButtonArray";
import FilterDropdown from "./FilterDropdown";

const FilterContainer = () => {

  const {setSearchParams} = useContext(GamesPageContext)

  return (
    <>
    <FilterButtonArray filterName="genres" filters={gameGenres} replace={false}/>
    <FilterButtonArray filterName="themes" filters={gameThemes} replace={false}/>
    <FilterButtonArray filterName="platforms" filters={gamePlatforms} replace={true}/>
    <FilterDropdown options={sortFilters} defaultVal="---Sort By---" filter="sort"/>
    <FilterDropdown options={minRatings} defaultVal="---Mininum Rating---" filter="minRating"/>
    <button onClick={() => setSearchParams()}>Clear Filters</button>
    </>
  )
}

export default FilterContainer;