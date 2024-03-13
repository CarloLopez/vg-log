import { NameObj } from "../../../api/apiTypes";

type NameButtonArrayProps = {
  items: NameObj[];
}

const NameButtonArray = ({ items }: NameButtonArrayProps) => {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item.id}>
            <button>{item.name}</button>
          </li>
        )})}
    </ul>
  )
}

export default NameButtonArray;