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
    <select 
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange(e);
        setCurrentSelection(e.target.value);
      }} 
      value={currentSelection ? currentSelection : ''} disabled={disabled}
      className="bg-slate-800 px-2 py-1"
    >
      {defaultLabel ? <option value={''}>{defaultLabel}</option> : ""}
      {options.map(option => {
        return <option key={option.value} value={option.value}>{option.label}</option>
      })}
    </select>
  )
}

export default Dropdown;