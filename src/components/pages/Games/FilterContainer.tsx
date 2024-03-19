import { gameGenres, gameThemes, gamePlatforms } from "../../../objects/filterObjects";
import FilterButtonArray from "./FilterButtonArray";

const FilterContainer = () => {

  return (
    <>
    <FilterButtonArray filterName="genres" filters={gameGenres}/>
    <FilterButtonArray filterName="themes" filters={gameThemes}/>
    <FilterButtonArray filterName="platforms" filters={gamePlatforms}/>
    </>
  )
}

export default FilterContainer;