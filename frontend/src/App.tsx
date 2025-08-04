import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import InitialTasks from "./util/InitialTasks";
import Events from "./pages/Events";
import { ModalContextProvider } from "./context/ModalContext";
import Preferences from "./pages/Preferences";
import Help from "./pages/Help";
import TermsAndConditions from "./pages/TermsAndConditions";
import Impressum from "./pages/Impressum";
import Contact from "./pages/Help";
import Discover from "./pages/Discover";
import Community from "./pages/Community";
import Publish from "./pages/Publish";
import LiveStreams from "./pages/LiveStreams";

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
            <Route path="/discover" element={<Discover />} />
            <Route path="/community" element={<Community />} />
            <Route path={`/publish/:profileId`} element={<Publish />} />
            <Route path="/help" element={<Help />} />
            <Route path="/livestreams" element={<LiveStreams />} />

            <Route
              path="/termsandconditions"
              element={<TermsAndConditions />}
            />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/preferences" element={<Preferences />} />
          </Route>
        </Routes>
      </ModalContextProvider>
    </>
  );
}
