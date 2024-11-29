import React from "react";
import "./Panel.css";

interface PanelProps {
  onDropRedSquare: () => void;
}

const Panel: React.FC<PanelProps> = ({ onDropRedSquare }) => {
  const colors = [
    "red",
    "green",
    "orange",
    "yellow",
    "blue",
    "purple",
    "pink",
    "cyan",
    "darkblue",
  ];

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, color: string) => {
    event.dataTransfer.setData("color", color);
  };

  return (
    <div className="panel">
      <div className="color-menu">
        {colors.map((color) => (
          <div
            key={color}
            className="color-square"
            style={{ backgroundColor: color }}
            draggable={color === "red"} // Только красный можно перетаскивать
            onDragStart={(event) => handleDragStart(event, color)}
          />
        ))}
      </div>
    </div>
  );
};

export default Panel;
