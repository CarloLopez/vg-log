import SIDEBAR_ITEMS from "./SideBarItems";
import { SetURLSearchParams } from "react-router-dom";

type GameBodySideBar = {
  setSearchParams: SetURLSearchParams;
};

const GameBodySidebar = ({ setSearchParams }: GameBodySideBar) => {
  return (
    <ul>
      {SIDEBAR_ITEMS.map((item) => {
        const onClick = () => {
          const newSearchParams = new URLSearchParams();
          newSearchParams.set('tab', item.id);
          setSearchParams(newSearchParams);
        }
        return (
          // update selected state in GameBody when clicked
          <li key={item.id}><button onClick={onClick}>{item.label}</button></li>
        )
      })}
    </ul>
  );
}

export default GameBodySidebar;