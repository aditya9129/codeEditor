import { useEffect, useRef, useState } from "react";

function WhiteBoard({ socketRef, roomid }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasHeight = window.innerHeight * 0.8; // Set the desired height (80% of window height)
    const canvasWidth = window.innerWidth * 0.66;

    canvas.width = canvasWidth * 2; // Double the width and height for better resolution
    canvas.height = canvasHeight * 2;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2); // Scale down the context to match the actual display size
    context.lineCap = "round";
    context.lineWidth = 5;
    contextRef.current = context;

    const handleDraw = ({
      offsetX,
      offsetY,
      prevOffsetX,
      prevOffsetY,
      tool,
      color,
    }) => {
      if (tool === "eraser") {
        context.globalCompositeOperation = "destination-out";
        context.lineWidth = 10;
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = color;
        context.lineWidth = 5;
      }
      context.beginPath();
      context.moveTo(prevOffsetX, prevOffsetY);
      context.lineTo(offsetX, offsetY);
      context.stroke();
    };

    socketRef.current.on("draw", handleDraw);
    socketRef.current.on("clear", clearCanvas);

    return () => {
      socketRef.current.off("draw", handleDraw);
      socketRef.current.off("clear", clearCanvas);
    };
  }, [socketRef]);

  useEffect(() => {
    if (contextRef.current && tool === "pencil") {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = 5;
    }
  }, [color, tool]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    contextRef.current.prevOffsetX = offsetX;
    contextRef.current.prevOffsetY = offsetY;
  };

  const endDrawing = () => {
    setIsDrawing(false);
    contextRef.current.closePath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const prevOffsetX = contextRef.current.prevOffsetX;
    const prevOffsetY = contextRef.current.prevOffsetY;

    if (tool === "eraser") {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = 10;
    } else {
      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = 5;
    }

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socketRef.current.emit("draw", {
      offsetX,
      offsetY,
      prevOffsetX,
      prevOffsetY,
      tool,
      color,
      roomid,
    });

    contextRef.current.prevOffsetX = offsetX;
    contextRef.current.prevOffsetY = offsetY;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    clearCanvas();
    socketRef.current.emit("clear", { roomid });
  };

  return (
    <div>
      <div className="flex flex-row-reverse">
        <button
          onClick={handleClear}
          className="mb-1 p-2 mr-1 bg-black text-white rounded"
        >
          Clear Board
        </button>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
          className="rounded-md mx-2 mt-2"
        />
        <button onClick={() => setTool("pencil")}>
          <img
            className="w-6 mx-2 rounded-md bg-white"
            src="https://www.svgrepo.com/show/532977/pencil.svg"
            alt="Pencil"
          />
        </button>
        <button onClick={() => setTool("eraser")}>
          <img
            className="w-6 mx-2 rounded-md bg-white"
            src="https://www.svgrepo.com/show/496171/eraser.svg"
            alt="Eraser"
          />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className="border border-black bg-white"
      />
    </div>
  );
}

export default WhiteBoard;
