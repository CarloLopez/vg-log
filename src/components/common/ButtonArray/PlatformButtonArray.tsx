import { Platform } from "../../../api/apiTypes";

type PlatformButtonArrayProps = {
  items: Platform[];
}

const PlatformButtonArray = ({ items }: PlatformButtonArrayProps) => {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <button>{item.abbreviation}</button>
          </li>
        )})}
    </ul>
  )
}

export default PlatformButtonArray;