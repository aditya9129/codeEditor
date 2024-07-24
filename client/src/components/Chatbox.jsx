/* eslint-disable react/prop-types */
import { useState } from "react";
import Member from "./Member";
import { useNavigate } from "react-router-dom";

export default function Chatbox({ clients, messages, user }) {
    const [showParticipants, setShowParticipants] = useState(false);
    const navigate = useNavigate();
    const handleLeaveRoom = () => {
        navigate("/");
      };
    return (
        <div className="bg-[#1f1f1f] w-full h-[82vh] flex flex-col" >

  <div className="flex justify-center">
    <button
      className={`p-2 m-2 rounded-md text-xl bg-white text-black `}
      onClick={() => setShowParticipants(!showParticipants)}
    >
      {showParticipants?'Chat':'Users'}
    </button>
   
    <button
      className={`p-2 m-2 rounded-md text-xl bg-black text-white hover:bg-[#363636]`}
      onClick={handleLeaveRoom}
    >
      Leave
    </button>
  </div>
  {showParticipants ? (
    <div className="grid grid-cols-1 gap-2 mt-2 p-2 ">
      {clients.map((info) => (
        <Member key={info.socketid} username={info.username} />
      ))}
    </div>
  ) : (
    <div className="h-[76vh] flex flex-col justify-end w-full bg-[#1f1f1f]" style={{ backgroundImage: `url(https://camo.githubusercontent.com/cba518ead87b032dc6f1cbfc7fade27604449201ac1baf34d889f77f093f01ac/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="overflow-auto p-2 ">
        {messages.slice().map((msg, idx) => (
          <div key={idx} className={`flex ${user !== msg.username ? 'justify-start' : 'justify-end'}`}>
            <div className={`mb-1 ${user !== msg.username ?'bg-black text-white'  : 'bg-[#363636] text-white'} rounded-lg p-2 inline-block max-w-full break-words`}>
              <strong>{msg.username}: </strong>
              {msg.message}
              <div>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

    );
}
