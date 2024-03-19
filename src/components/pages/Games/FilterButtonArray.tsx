import FilterButton from "./FilterButton";

type FilterButtonArray = {
  filters: {id: string, name: string}[];
  filterName: string;
}

const FilterButtonArray = ({filters, filterName}: FilterButtonArray) => {
  
  return (
    <>
      <h4>{filterName.charAt(0).toUpperCase() + filterName.slice(1)}</h4>
      <ul>
        {
          filters.map((filter) => {
            return (
              <li key={filter.id}>
                <FilterButton filter={filterName} value={filter.id} name={filter.name} />
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

export default FilterButtonArray;