import React from "react";
import DraggableSquare from "./DraggableSquare";
import "./MenuPanel.css";

const colors = ["red", "green", "blue", "orange", "yellow", "purple", "cyan"];

const MenuPanel: React.FC = () => {
  return (
    <div className="menu-panel">
      {colors.map((color) => (
        <DraggableSquare key={color} color={color} />
      ))}
    </div>
  );
};

export default MenuPanel;
