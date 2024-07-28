import Editor from "./CodeEditor";
import Chat from "./Chat";
import { initSocket } from "../../socket";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate, } from "react-router-dom";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
export default function Room() {
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [code, setcode] = useState("");
  const [user, setuser] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { roomid } = useParams();
  const[socketid,setsocketid]=useState();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current.emit("join", {
        roomid,
        username: location.state?.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketid }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        console.log(socketid)
        setClients(clients);
        setuser(location.state?.username);
        setsocketid(socketid);
        const code = editorRef.current.editor.getValue();
        if (code) {
          socketRef.current.emit("sync-change", {
            roomid,
            code,
          });
         
        }
      });
    
      socketRef.current.on("sync", ( code ) => {
        setcode(code);
      });
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} left the room.`);
          console.log(`${username} joined`);
        }

        setClients((prev) =>
          prev.filter((client) => client.socketid !== socketId)
        );
      });

      socketRef.current.on("message", (message) => {
        console.log(message);
        setMessages((prev) => [...prev, message]);
      });
      socketRef.current.on("chat_history", (chatHistory) => {
      
        setMessages(chatHistory);
      });
    
    };

    init();
    //when we return from useEffect it is cleaning function Cleanup: Remove event listeners when the component unmounts.
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
        socketRef.current = null;
      }
    };
  }, [location.state?.username, navigate, roomid, socketRef]);
  return (
    <div className="w-full flex h-screen bg-black">
      <div className="w-1/3 ">
        <Chat socketRef={socketRef} clients={clients} messages={messages} user={user} roomid={roomid}  socketid={socketid}/>
      </div>
      <div className="bg-black w-2/3  h-full">
        <Editor editorRef={editorRef} socketRef={socketRef} roomid={roomid} code={code} user={user}/>
      </div>
      <Toaster/>
    </div>
  );
}
