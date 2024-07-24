/* eslint-disable react/prop-types */
import { useState} from "react";
import { useLocation} from "react-router-dom";
import Chatbox from "./Chatbox.jsx";

export default function Chat({
  socketRef,
  clients,
  messages,
  user,
  roomid,
  socketid,
}) {
  const [message, setMessage] = useState("");
  const location = useLocation();

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  const handleMessageSend = () => {
    let time = getCurrentTime();
    if (message.trim()) {
      socketRef.current.emit("message", {
        username: location.state?.username,
        message,
        roomid,
        time,
        socketid,
      });

      setMessage("");
    }
  };

 

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  return (
    <div className="bg-[#1f1f1f] w-full flex flex-col border rounded-lg space-y-4 items-center">
    <div className=" ">
      <h1 className="text-xl text-white font-semibold p-1">ChatBox</h1>
    </div>
    <Chatbox
      clients={clients}
      messages={messages}
      user={user}
      socketid={socketid}
      className="flex-grow"
    />
    <div className="flex p-2 mx-auto w-full space-x-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow p-2 rounded-l-md bg-[#020002] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        onClick={handleMessageSend}
        className="bg-white rounded-r-md p-2 text-white flex items-center justify-center"
      >
        <img
          width="20"
          height="20"
          className="bg-white"
          src="https://img.icons8.com/ios-glyphs/30/filled-sent.png"
          alt="filled-sent"
        />
      </button>
    </div>
   
  </div>
  

  
  );
}
