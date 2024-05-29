import { useContext, useState, useEffect } from "react";
import { GamesPageContext } from "./GamesPage";

type FilterButton = {
  filter: string;
  value: string;
  name: string;
  replace: boolean;
}

const FilterButton = ({filter, value, name, replace}: FilterButton) => {

  const [isActive, setIsActive] = useState(false);
  const {searchParams, setSearchParams} = useContext(GamesPageContext);
  
  useEffect(() => {
    const checkIsActive = () => {
      const param = searchParams.get(filter);
      if (!param) {
        return false;
      }
      const paramValues = param.split(',');
      return paramValues.includes(value);
    };  

    setIsActive(checkIsActive());
  }, [filter, searchParams, value]);
  
  const updateSearchParams = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    const param = newSearchParams.get(filter);

    if (!param) {
      newSearchParams.set(filter, value);
    } else {
      const isArray = param.includes(',');

      if (isArray) {
        const paramArray = param.split(',');
        
        if (paramArray.includes(value)) {
          const filteredArray = paramArray.filter(item => item !== value);
          newSearchParams.set(filter, filteredArray.join(','));
        } else {
          paramArray.push(value);
          newSearchParams.set(filter, paramArray.join(','));
        }
      } else {
        // if same filter value clicked, delete filter. else, if button is replace-only, replace the value with new value
        param === value ? newSearchParams.delete(filter) : newSearchParams.set(filter, (replace ? value : param + `,${value}`));
      }
      }

      setSearchParams(newSearchParams, {replace: true});
    }

    // Apply conditional styling based on the isActive state
    const buttonStyle = isActive ? { backgroundColor: 'green', color: 'white' } : {};

  return (
    <>
      <button onClick={() => updateSearchParams()}  style={buttonStyle}>{name}</button>
    </>
  )
}

export default FilterButton;