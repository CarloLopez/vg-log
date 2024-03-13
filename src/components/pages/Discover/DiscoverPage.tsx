import { Link } from "react-router-dom";

const DiscoverPage = () => {
  return (
    <>
      Discover Page
      <hr />
      <Link to='/game/baldurs-gate-3'>Baldur's Gate 3</Link>
      <hr />
      <Link to='/game/mass-effect-legendary-edition'>Mass Effect LE</Link>
      <hr />
      <Link to='/game/final-fantasy-xiv-online--1'>Final Fantasy XIV</Link>
    </>
  );
}

export default DiscoverPage;