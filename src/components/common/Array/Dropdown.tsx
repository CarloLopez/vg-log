type DropdownProps = {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: {value: string, label:string}[];
  defaultLabel: string;
}

const Dropdown = ({handleChange, options, defaultLabel}: DropdownProps) => {
  return (
    <select onChange={handleChange}>
      <option value={''}>{defaultLabel}</option>
      {options.map(option => {
        return <option key={option.value} value={option.value}>{option.label}</option>
      })}
    </select>
  )
}

export default Dropdown;