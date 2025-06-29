import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import Sidebar from "./Sidebar";
import { useModalContext } from "../context/ModalContext";

export default function Layout() {
  const { setIsSidebarOpen, isSidebarOpen } = useModalContext();

  return (
    <>
      <NavBar
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main className="main_div">
        <Outlet />
      </main>
    </>
  );
}
