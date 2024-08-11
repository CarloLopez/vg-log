import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../App";

const NavBar = () => {

  const {username} = useContext(LoginContext);

  const location = useLocation();
  const isBacklog = location.pathname.endsWith('/backlog');
  const isHome = location.pathname.endsWith('/home');
  const isGames = location.pathname.endsWith('/games');
  

  return (
    <nav className="relative flex justify-center p-2.5">
      <ul className="list-none flex flex-row space-x-2">
        <li 
          className="transform hover:text-amber-500 hover:scale-105 font-bold"
          style={isBacklog ? {color : '#f59e0b', textDecoration: 'underline'} : {}}
        >
          <Link to='backlog'>BACKLOG</Link>
        </li>
        <li 
          className="transform hover:text-amber-500 hover:scale-105 font-bold"
          style={isHome ? {color : '#f59e0b', textDecoration: 'underline'} : {}}
        >
          <Link to='home'>HOME</Link>
        </li>
        <li 
          className="transform hover:text-amber-500 hover:scale-105 font-bold"
          style={isGames ? {color : '#f59e0b', textDecoration: 'underline'} : {}}
        >
          <Link to='games'>GAMES</Link>
        </li>
      </ul>
      <div className="absolute right-0 pr-4 transform hover:text-amber-500 hover:scale-105">
        <Link to='profile'>{username ? "Logout" : "Log-In"}</Link>
      </div>
    </nav>
  );
}

export default NavBar;