import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import InitialTasks from "./util/InitialTasks";

export default function App() {
  return (
    <>
      <InitialTasks />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}
