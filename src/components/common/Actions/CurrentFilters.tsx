import { FilterArrayItem } from "../../pages/Discover/DiscoverPage";
import { gameThemes, gameGenres, gamePlatforms } from "../../../objects/filterObjects";
import { NameObj } from "../../../api/apiTypes";

type CurrentFiltersProps = {
  filterArray: FilterArrayItem[];
  setFilterArray: React.Dispatch<React.SetStateAction<FilterArrayItem[]>>;
}

type CurrentFilterItemsProps = {
  filterItem: FilterArrayItem;
  filterArray: FilterArrayItem[];
  setFilterArray: React.Dispatch<React.SetStateAction<FilterArrayItem[]>>;
}

type deleteFromArrayParams = {
  key: string;
  value: number;
}

const CurrentFilterItems = ({filterItem, setFilterArray}: CurrentFilterItemsProps) => {
  
  const key = filterItem.key;
  let mapping: NameObj[] = [];

  switch (filterItem.key) {
    case 'genres':
      mapping = gameGenres;
      break;
    case 'themes':
      mapping = gameThemes;
      break;
    case 'platforms':
      mapping = gamePlatforms;
      break;
  }

  const deleteFromArray = ({key, value}: deleteFromArrayParams) => {

    if (filterItem.values.includes(value)) {

      setFilterArray((prevFilterArray) => {
        let newFilterArray = [...prevFilterArray];

        const objIndex = newFilterArray.findIndex(item => item.key === key);
        const filter = newFilterArray[objIndex];

        filter.values = filter.values.filter(item => item !== value);

        if (filter.values.length === 0) {
          newFilterArray = newFilterArray.filter(item => item.key !== key);
        }

        return newFilterArray;
      })
    }
  }
  
  return (
    <>
      {
        filterItem.values.map((value) => {
          
          if (mapping.length > 0) {

            const nameObj = mapping.find(item => item.id === value);
            const name = nameObj?.name;

            if (name) {
              return <li key={name}><button onClick={() => deleteFromArray({key: key, value: value})}>{name}</button></li>
            }
          }

        })
      }
    </>
  )
}

const CurrentFilters = ({filterArray, setFilterArray}: CurrentFiltersProps) => {

  return (
    <ul>
      {
        filterArray.map((filterItem) => {
          return <CurrentFilterItems key={filterItem.key} filterItem={filterItem} filterArray={filterArray} setFilterArray={setFilterArray}/>
        })
      }
    </ul>
  )

}

export default CurrentFilters;