# LiveCodeSpace

A real-time collaborative code editor and whiteboard application built using React, AceEditor, Socket.IO, and Node.js.

## Features

- Real-time code editing with support for multiple programming languages(C++, Java, JavaScript, Python).
- Real-time whiteboard for collaborative drawing and annotations.
- Integrated chat system for seamless communication.
- Room-based collaboration with userID authentication.

## Technologies Used

- **Frontend:** React, AceEditor
- **Backend:** Node.js, Express, Socket.IO, axios
- **Styling:** Tailwind CSS

## Live Demo

Check out the live demo of the project here: [LiveCodeSpace](https://thriving-stardust-820319.netlify.app/)

## Installation

**Clone the repository:**
   **git clone** https://github.com/aditya9129/codeEditor

## Screenshots

![image](https://github.com/user-attachments/assets/9119b930-0f53-4aa1-9d01-8699bf90a32d)

**Code Editor**

![image](https://github.com/user-attachments/assets/1c0a2573-57ce-4e33-b244-249ae8a9259e)

**WhiteBoard And ChatBox**

![image](https://github.com/user-attachments/assets/586bc2e3-0b34-4c11-a3f6-645791f3cf7f)


## Project Structure

The project is organized into two main directories: `client` and `server`.

### Client

The `client/src` directory contains the React components and styles used in the frontend of the application.

- **App.js**: The main component that sets up the routes for the application.
- **Editor.js**: Component for the code editor, using AceEditor for syntax highlighting and code editing.
- **WhiteBoard.js**: Component for the whiteboard.
- **Chat.js**: Component for the chat system.
- **Chatbox.js**: Sub-component for handling chat messages.
- **NewRoom.js**: Component for entering room ID and username.
- **LiveWhiteBoard.js**: Component for live whiteboard sessions.
- **Room.js**: Component for managing the room.
- **components**: Directory containing reusable components like `Member.js`.

### Server

The `server` directory contains the server-side code.

- **server.js**: Main server file, setting up the backend with Node.js and socket.io for real-time communication.

