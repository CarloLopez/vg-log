import SIDEBAR_ITEMS from "./SideBarItems";
import { SetURLSearchParams } from "react-router-dom";

type GameBodySideBar = {
  setSearchParams: SetURLSearchParams;
};

const GameBodySidebar = ({ setSearchParams }: GameBodySideBar) => {
  return (
    <ul className="flex flex-col gap-1">
      {SIDEBAR_ITEMS.map((item) => {
        const onClick = () => {
          const newSearchParams = new URLSearchParams();
          newSearchParams.set('tab', item.id);
          setSearchParams(newSearchParams);
        }
        return (
          // update selected state in GameBody when clicked
          <li key={item.id}><button onClick={onClick} className="bg-slate-700 rounded px-2 hover:scale-105 w-full">{item.label}</button></li>
        )
      })}
    </ul>
  );
}

export default GameBodySidebar;