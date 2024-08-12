import { Routes, Route } from "react-router-dom";
import HomeRoute from "./routes/HomeRoute";
import ChessRoute from "./routes/ChessRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/play" element={<ChessRoute />} />
    </Routes>
  );
}
