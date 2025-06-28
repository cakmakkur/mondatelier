import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";

export default function App() {
  return (
    <div className="main_div">
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  );
}
