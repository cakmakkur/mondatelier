import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Sidebar />
      <main className="main_div">
        <Outlet />
      </main>
    </>
  );
}
