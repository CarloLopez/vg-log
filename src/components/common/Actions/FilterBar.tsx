import { useContext } from "react";
import FilterButtonArray from "../Array/FilterButtonArray";
import CurrentFilters from "./CurrentFilters";
import { gameGenres, gameThemes, gamePlatforms } from "../../../objects/filterObjects";
import { DiscoverContext } from "../../pages/Discover/DiscoverPage";

const FilterBar = () => {

  const {filterArray, setFilterArray, setSearchParams} = useContext(DiscoverContext);
  
  const generateSearchParams = () => {

    const params = new URLSearchParams;

      filterArray.forEach((filterItem) => {
        const key = filterItem.key;
    
        let values = filterItem.values.join(',');
        if (filterItem.exact) values += ',exact';

        params.set(key, values);
      });

    setSearchParams(params, {replace: true});
  }
  
  return (
    <>
    <div>
      <div>
        <h4>Genres</h4>
        <FilterButtonArray items={gameGenres} itemsType="genres" />
      </div>
      <div>
        <h4>Themes</h4>
        <FilterButtonArray items={gameThemes} itemsType="themes" />
      </div>
      <div>
        <h4>Platforms</h4>
        <FilterButtonArray items={gamePlatforms} itemsType="platforms" />
      </div>
    </div>
    <hr />
    <div>
      <h4>Current Filters</h4>
      <CurrentFilters filterArray={filterArray} setFilterArray={setFilterArray}/>
    </div>
    <button onClick={generateSearchParams}>Filter</button>
    </>
  )
}

export default FilterBar;