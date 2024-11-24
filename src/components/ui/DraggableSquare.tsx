import React from "react";
import "./DraggableSquare.css";

interface DraggableSquareProps {
  color: string;
}

const DraggableSquare: React.FC<DraggableSquareProps> = ({ color }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("color", color); // Передаем цвет квадрата
  };

  return (
    <div
      className="draggable-square"
      style={{ backgroundColor: color }}
      draggable
      onDragStart={handleDragStart}
    ></div>
  );
};

export default DraggableSquare;
