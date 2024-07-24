import { Routes, Route, Navigate } from "react-router-dom";
import NewRoom from "./components/NewRoom";
import WhiteBoard from "./components/WhiteBoard";
import Room from "./components/Room";
import LiveWhiteBoard from "./components/LiveWhiteboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewRoom />} />
      <Route path="/whiteboard" element={<WhiteBoard />} />
      <Route path="/livewhiteboard/:roomid" element={<LiveWhiteBoard />} />
      <Route path="/room/:roomid" element={<Room />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
