import { SetURLSearchParams } from "react-router-dom";
import FilterButtonArray from "../Array/FilterButtonArray";
import CurrentFilters from "./CurrentFilters";
import { gameGenres, gameThemes } from "../../../objects/filterObjects";
import { filterArrayItem } from "../../pages/Discover/DiscoverPage";

type FilterBarProps = {
  filterArray: filterArrayItem[];
  setFilterArray: React.Dispatch<React.SetStateAction<filterArrayItem[]>>;
  setSearchParams: SetURLSearchParams;
}

const FilterBar = ({filterArray, setFilterArray, setSearchParams}: FilterBarProps) => {
  
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
        <FilterButtonArray items={gameGenres} itemsType="genres" filterArray={filterArray} setFilterArray={setFilterArray}/>
      </div>
      <div>
        <h4>Themes</h4>
        <FilterButtonArray items={gameThemes} itemsType="themes" filterArray={filterArray} setFilterArray={setFilterArray}/>
      </div>
      <div>
        <h4>Current Filters</h4>
        <CurrentFilters filterArray={filterArray} setFilterArray={setFilterArray}/>
      </div>
    </div>
    <button onClick={generateSearchParams}>Filter</button>
    </>
  )
}

export default FilterBar;