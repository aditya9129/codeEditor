//When initSocket is called, it establishes a new WebSocket connection to the specified backend URL using the provided options, 
//and returns the socket instance. This socket instance can then be used to communicate with the server in real-time.

import {io} from 'socket.io-client';
export const initSocket=async()=>{

   const options={
    'force new connection':true,       //Forces a new connection every time this function is called, rather than reusing an existing connection.
     reconnectionAttempt:'Infinity',   //unlimited reconnects if the connection is lost
     timeout:1000000,                    //Sets a timeout of 10,000 milliseconds (10 seconds) for the connection to be established.
     transports:['websocket'],         //Specifies that the connection should use WebSocket as the transport protocol.

   };
   return io('http://localhost:5000',options);
}
// 
// http://localhost:5000
