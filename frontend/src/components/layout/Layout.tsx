import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="min-h-screen max-w-7xl flex-auto">
      <NavBar />
      <hr/>
      <div className="p-1">
        <Outlet />
      </div>
    </div>
    </div>
  );
}

export default Layout;