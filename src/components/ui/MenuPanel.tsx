import React from "react";
// import DraggableSquare from "./DraggableSquare";
import DraggableItem from "./DraggableItem";
import "./MenuPanel.css";

const cardSets = ["mafia", "spy"];

const MenuPanel: React.FC = () => {
  return (
    <div className="menu-panel">
      {cardSets.map((cardSet) => (
        <DraggableItem key={cardSet} value={cardSet} />
      ))}
    </div>
  );
};

export default MenuPanel;
