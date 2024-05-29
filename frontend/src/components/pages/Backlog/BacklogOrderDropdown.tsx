import React, { useContext } from "react";
import { BacklogPageContext } from "./BacklogPage";
import Dropdown from "../../common/Array/Dropdown";

const BacklogOrderDropdown = () => {
  
  const {setOrder} = useContext(BacklogPageContext);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOrder(value);
  }

  const options = [
    {value: 'name', label: 'Name'},
  ]

  return (
    <>
      <Dropdown handleChange={handleChange} options={options} defaultLabel="Status"/>
    </>
  )
}

export default BacklogOrderDropdown;