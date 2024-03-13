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
        <Link to='discover'>Discover</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;