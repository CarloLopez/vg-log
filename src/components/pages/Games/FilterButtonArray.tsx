import FilterButton from "./FilterButton";

type FilterButtonArray = {
  filters: {id: string, name: string}[];
  filterName: string;
  replace: boolean;
}

const FilterButtonArray = ({filters, filterName, replace}: FilterButtonArray) => {
  
  return (
    <>
      <h4>{filterName.charAt(0).toUpperCase() + filterName.slice(1)}</h4>
      <ul>
        {
          filters.map((filter) => {
            return (
              <li key={filter.id}>
                <FilterButton filter={filterName} value={filter.id} name={filter.name} replace={replace}/>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default FilterButtonArray;