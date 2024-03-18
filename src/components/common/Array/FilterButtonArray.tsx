import { useState, useEffect } from "react";
import { NameObj } from "../../../api/apiTypes";
import { filterArrayItem } from "../../pages/Discover/DiscoverPage";

type FilterButtonArrayProps = {
  items: NameObj[];
  itemsType: string;
  filterArray: filterArrayItem[];
  setFilterArray: React.Dispatch<React.SetStateAction<filterArrayItem[]>>;
}

const FilterButtonArray = ({ items, itemsType, filterArray, setFilterArray }: FilterButtonArrayProps) => {

  const [exactChecked, setExactChecked] = useState(false);
  
  const addToFilterArray = (value: number) => {
    
    setFilterArray((prevFilterArray) => {

      const newFilterArray = [...prevFilterArray];
      const objIndex = newFilterArray.findIndex(item => item.key === itemsType);

      if (objIndex !== -1) {
        if (!newFilterArray[objIndex].values.includes(value)) {
          newFilterArray[objIndex].values.push(value);

          if (exactChecked) newFilterArray[objIndex].exact = true;
        }
      } else {
        newFilterArray.push({
          key: itemsType,
          values: [value],
          ...(exactChecked ? {exact: true} : {}),
        });
      }

      return newFilterArray;
    })
  }

  useEffect((() => {
    setFilterArray((prevFilterArray) => {
      const newFilterArray = [...prevFilterArray];
      const objIndex = newFilterArray.findIndex(item => item.key === itemsType);
      
      if (objIndex !== -1) {
        
        if (exactChecked) {
          newFilterArray[objIndex].exact = true;
        } else if (newFilterArray[objIndex].exact) {
          delete newFilterArray[objIndex].exact;
        }
      }

      return newFilterArray;
    })
  }), [exactChecked, itemsType, setFilterArray])

  const checkButtonDisabled = (id: number) => {
    const objIndex = filterArray.findIndex(item => item.key === itemsType);

    if (objIndex !== -1) {
      const values = filterArray[objIndex].values;
      return values.includes(id);
    }
  }
  
  return (
    <div>
      <ul>
        {
          items.map((item) => {
            return <li key={item.id}><button onClick={() => addToFilterArray(item.id)} disabled={checkButtonDisabled(item.id)}>{item.name}</button></li>
          })
        }
      </ul>
      <div>      
        <label htmlFor="exact">Exact Match:</label>
        <input 
          type="checkbox" 
          id="exact" 
          name="exact" 
          checked={exactChecked} 
          onChange={() => setExactChecked((current) => !current)}
        />
      </div>
    </div>
  )
}

export default FilterButtonArray;