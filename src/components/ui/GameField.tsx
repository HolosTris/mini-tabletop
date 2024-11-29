import React, { useState } from "react";
import Panel from "./Panel";
import "./Panel.css";

interface Card {
  id: number;
  role: string;
}

const GameField: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const roles = ["Мафия", "Детектив", "Доктор", "Мирный житель"];

  const handleDropRedSquare = () => {
    // Генерация новой колоды карт с ролями
    const newCards = roles.map((role, index) => ({
      id: index,
      role: role,
    }));
    setCards(newCards);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const color = event.dataTransfer.getData("color");
    if (color === "red") {
      handleDropRedSquare();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="game-container">
      <Panel onDropRedSquare={handleDropRedSquare} />
      <div
        className="game-field"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {cards.length === 0 ? (
          <p className="drop-instruction">Перетащите красный квадрат сюда</p>
        ) : (
          <div className="cards-container">
            {cards.map((card) => (
              <div key={card.id} className="mafia-card">
                {card.role}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameField;
