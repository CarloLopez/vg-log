import React, { useContext } from "react";
import { GamesPageContext } from "./GamesPage";

type FilterDropdown = {
  options: {value: string, label: string}[];
  defaultVal: string;
  filter: string;
  handleDisabled?: () => boolean;
}

const FilterDropdown = ({options, defaultVal, filter, handleDisabled}: FilterDropdown) => {
  
  const {searchParams, setSearchParams} = useContext(GamesPageContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const value = e.target.value;

    if (value) {
      newSearchParams.set(filter, value);
    } else {
      newSearchParams.delete(filter);
    }

    setSearchParams(newSearchParams);
  }
  
  const getParamValue = () => {
    const value = searchParams.get(filter);

    if (value) {
      if (options.some(optionItem => optionItem.value === value)) {
        return value;
      }
    } else {
      return "";
    }
  }

  const paramValue = getParamValue()
  
  return (
    <select name={filter} onChange={handleChange} value={paramValue} disabled={handleDisabled ? handleDisabled() : false}>
      <option value={""}>{defaultVal}</option>
      {options.map((optionItem) => {
        return <option key={optionItem.value} value={optionItem.value}>{optionItem.label}</option>
      })}
    </select>
  )
}

export default FilterDropdown;