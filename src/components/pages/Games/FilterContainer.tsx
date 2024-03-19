import { gameGenres, gameThemes, gamePlatforms, sortFilters, minRatings } from "../../../objects/filterObjects";
import FilterButtonArray from "./FilterButtonArray";
import FilterDropdown from "./FilterDropdown";

const FilterContainer = () => {

  return (
    <>
    <FilterButtonArray filterName="genres" filters={gameGenres}/>
    <FilterButtonArray filterName="themes" filters={gameThemes}/>
    <FilterButtonArray filterName="platforms" filters={gamePlatforms}/>
    <FilterDropdown options={sortFilters} defaultVal="---Sort By---" filter="sort"/>
    <FilterDropdown options={minRatings} defaultVal="---Mininum Rating---" filter="minRating"/>
    </>
  )
}

export default FilterContainer;