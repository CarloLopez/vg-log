import { useContext } from "react";
import { DiscoverContext } from "../../pages/Discover/DiscoverPage";
import FilterButtonArray from "../Array/FilterButtonArray";
import CurrentFilters from "./CurrentFilters";
import OrderDropdown from "../Array/OrderDropdown";
import { gameGenres, gameThemes, gamePlatforms } from "../../../objects/filterObjects";

const FilterBar = () => {

  const {filterArray, setFilterArray, setSearchParams} = useContext(DiscoverContext);
  
  const generateSearchParams = () => {

    const params = new URLSearchParams;

      filterArray.forEach((filterItem) => {
        const key = filterItem.key;
        
        if (filterItem.values.length > 0) {
          let values = filterItem.values.join(',');
          if (filterItem.exact) values += ',exact';

          params.set(key, values);
          // string value means it is a sorting filter.
        } else if (filterItem.stringValue) {
          params.set(key, filterItem.stringValue);
        }

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
    <OrderDropdown />
    </>
  )
}

export default FilterBar;