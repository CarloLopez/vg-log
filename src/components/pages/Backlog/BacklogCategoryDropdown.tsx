import React, { useContext } from "react";
import { BacklogPageContext } from "./BacklogPage";
import Dropdown from "../../common/Array/Dropdown";

const BacklogCategoryDropdown = () => {
  
  const {categories, setCategory} = useContext(BacklogPageContext);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
  }

  const options = categories.map(category => {
    return {value: category.id.toString(), label: category.name};
  })

  return (
    <>
      <Dropdown handleChange={handleChange} options={options} defaultLabel="All"/>
    </>
  )
}

export default BacklogCategoryDropdown;