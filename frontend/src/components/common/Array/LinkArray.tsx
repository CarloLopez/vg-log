import { NameObj } from "../../../../../shared/types/gameTypes";
import { Link } from "react-router-dom";

type LinkArrayProps = {
  items: NameObj[];
}

const LinkArray = ({ items }: LinkArrayProps) => {
  return (
    <ul className="flex gap-2">
      {items.map((item) => {
        return (
          <li key={item.id}>
            <Link to='/'>{item.name}</Link>
          </li>
        )})}
    </ul>
  )
}

export default LinkArray;