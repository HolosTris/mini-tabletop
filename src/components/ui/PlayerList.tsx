import React, { useState } from "react";
import "./PlayerList.css";

interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleList = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`player-list ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="toggle-button" onClick={toggleList}>
        {isExpanded ? "Свернуть" : "Развернуть"}
      </button>
      {isExpanded && (
        <ul>
          {players.map((player) => (
            <li key={player.id} className="player-item">
              {player.avatarUrl ? (
                <img src={player.avatarUrl} alt={player.name} className="avatar" />
              ) : (
                <div className="no-avatar">No Avatar</div>
              )}
              <span className="player-name">{player.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;
