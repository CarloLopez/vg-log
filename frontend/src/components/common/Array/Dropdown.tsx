import { useState } from "react"

type DropdownProps = {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {value: string, label:string}[];
  defaultLabel?: string;
  defaultSelection?: string;
  disabled?: boolean;
}

const Dropdown = ({handleChange, options, defaultLabel, defaultSelection, disabled = false}: DropdownProps) => {
  const [currentSelection, setCurrentSelection] = useState(defaultSelection);
  
  return (
    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange(e);
      setCurrentSelection(e.target.value);
    }} value={currentSelection} disabled={disabled}>
      {defaultLabel ? <option value={''}>{defaultSelection}</option> : ""}
      {options.map(option => {
        return <option key={option.value} value={option.value}>{option.label}</option>
      })}
    </select>
  )
}

export default Dropdown;