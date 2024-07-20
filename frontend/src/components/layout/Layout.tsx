import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <hr />
      <div className="p-1">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;