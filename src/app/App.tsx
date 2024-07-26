import { Routes, Route } from "react-router-dom";
import HomeRoute from "./routes/HomeRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
    </Routes>
  );
}
