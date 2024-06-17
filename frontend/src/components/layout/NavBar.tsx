import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../App";

const NavBar = () => {

  const {username} = useContext(LoginContext);

  return (
    <nav>
      <ul>
        <li>
          <Link to='backlog'>Backlog</Link>
        </li>
        <li>
        <Link to='home'>Home</Link>
        </li>
        <li>
        <Link to='games'>Games</Link>
        </li>
      </ul>
      <div>
        <Link to='profile'>{username ? username : "Log In/Sign Up"}</Link>
      </div>
      <hr />
    </nav>
  );
}

export default NavBar;