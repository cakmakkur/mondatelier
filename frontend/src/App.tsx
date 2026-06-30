import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import InitialTasks from "./util/InitialTasks";
import { ModalContextProvider } from "./context/ModalContext";

const Homepage = lazy(() => import("./pages/Homepage"));
const Profile = lazy(() => import("./pages/Profile"));
const Events = lazy(() => import("./pages/Events"));
const Preferences = lazy(() => import("./pages/Preferences"));
const Help = lazy(() => import("./pages/Help"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Contact = lazy(() => import("./pages/Contact"));
const Discover = lazy(() => import("./pages/Discover"));
const Community = lazy(() => import("./pages/Community"));
const Publish = lazy(() => import("./pages/Publish"));
const LiveStreams = lazy(() => import("./pages/LiveStreams"));
const Feed = lazy(() => import("./components/community/Feed"));
const FullPost = lazy(() => import("./components/community/FullPost"));
const NotReadyYet = lazy(() => import("./pages/NotReadyYet"));

export default function App() {
  return (
    <>
      <InitialTasks />
      <ModalContextProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Homepage />} />
              <Route path="/profile/:profileId" element={<Profile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/community" element={<Community />}>
                <Route index element={<Feed />} />
                <Route path=":communityId" element={<Feed />} />
                <Route path="liked" element={<Feed />} />
                <Route path="post/:postId" element={<FullPost />} />
              </Route>
              <Route path="/publish/:profileId" element={<Publish />} />
              <Route path="/help" element={<Help />} />
              <Route path="/livestreams" element={<LiveStreams />} />
              <Route path="/not-ready" element={<NotReadyYet />} />
              <Route
                path="/termsandconditions"
                element={<TermsAndConditions />}
              />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/preferences" element={<Preferences />} />
            </Route>
          </Routes>
        </Suspense>
      </ModalContextProvider>
    </>
  );
}
