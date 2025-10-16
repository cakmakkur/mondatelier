import { Outlet } from "react-router-dom";
import NavBar from "./nav/Navbar";
import Sidebar from "./nav/Sidebar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Sidebar />
      <main style={{ minWidth: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
}
