import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../App";

const NavBar = () => {

  const {username} = useContext(LoginContext);

  return (
    <nav className="flex flex-row justify-between p-1">
      <ul className="list-none flex flex-row space-x-2">
        <li className="transform hover:text-amber-500 hover:scale-105">
          <Link to='backlog'>Backlog</Link>
        </li>
        <li className="transform hover:text-amber-500 hover:scale-105">
        <Link to='home'>Home</Link>
        </li>
        <li className="transform hover:text-amber-500 hover:scale-105">
        <Link to='games'>Games</Link>
        </li>
      </ul>
      <div className="transform hover:text-amber-500 hover:scale-105">
        <Link to='profile'>{username ? "Logout" : "Log-In"}</Link>
      </div>
    </nav>
  );
}

export default NavBar;