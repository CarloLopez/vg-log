import React, { useContext, useEffect, useState } from "react";
import { DiscoverContext } from "../../pages/Discover/DiscoverPage";
import { orderFilters } from "../../../objects/filterObjects";

const OrderDropdown = () => {
  
  const { setFilterArray, searchParams } = useContext(DiscoverContext);
  
  let initialState: string = orderFilters[0].value;

  // set initialState of dropdown to url parameter-specified fieldSort, if it is specified
  if (searchParams.has('fieldSort') && searchParams.has('sortBy')) {
    const fieldSortState = searchParams.get('fieldSort');
    if (fieldSortState) {
      initialState = fieldSortState;
    }
  }

  const [selectedValue, setSelectedValue] = useState(initialState);
  
  useEffect((() => {
    setFilterArray((prevFilterArray) => {
      const newFilterArray = [...prevFilterArray];

      const fieldSortIndex = newFilterArray.findIndex(item => item.key === 'fieldSort');

      // delete the sort fields in filterArray if no order filter is selected
      if (selectedValue === 'none' && fieldSortIndex !== -1) {
        newFilterArray.splice(fieldSortIndex, 1);

        const sortByIndex = newFilterArray.findIndex(item => item.key === 'sortBy');
        newFilterArray.splice(sortByIndex, 1);

        return newFilterArray;
      }
      
      // add fieldSort and sortBy filters to filterArray when an order by value is selected
      if (fieldSortIndex !== -1) {
        newFilterArray[fieldSortIndex].stringValue = selectedValue;
      } else {
        const fieldSortItem = {key: 'fieldSort', values: [], stringValue: selectedValue};
        const sortByItem = {key: 'sortBy', values: [], stringValue: 'desc'};

        newFilterArray.push(fieldSortItem);
        newFilterArray.push(sortByItem);
      }

      return newFilterArray;
    })
  }), [selectedValue, setFilterArray])
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  }

  return (
    <select value={selectedValue} onChange={handleChange}>
      {orderFilters.map((filter) => {
        const filterLabel = filter.label;
        const filterValue = filter.value;

        return <option key={filterValue} value={filterValue}>{filterLabel}</option>
      })}
    </select>
  )
}

export default OrderDropdown;