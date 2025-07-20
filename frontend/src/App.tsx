import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import InitialTasks from "./util/InitialTasks";
import Events from "./pages/Events";
import { ModalContextProvider } from "./context/ModalContext";
import Preferences from "./pages/Preferences";

export default function App() {
  return (
    <>
      <InitialTasks />
      <ModalContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="events" element={<Events />} />
            <Route path="/preferences" element={<Preferences />} />
          </Route>
        </Routes>
      </ModalContextProvider>
    </>
  );
}
