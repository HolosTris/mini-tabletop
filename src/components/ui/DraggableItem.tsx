import React from "react";
import "./DraggableItem.css";

interface DraggableItemProps {
  value: string;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ value }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("value", value); // Передаем значение в canvas
  };

  return (
    <div
      className="draggable-item"
      style={{ backgroundImage: "url(src/assets/mafia_card_set_icon.png)" }}
      draggable
      onDragStart={handleDragStart}
    ></div>
  );
};

export default DraggableItem;
