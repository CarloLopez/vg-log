import { Link } from "react-router-dom";

const NavBar = () => {
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
      <hr />
    </nav>
  );
}

export default NavBar;