import React from "react";

interface Player {
  id: string;
  name: string;
  avatarUrl?: string; // URL для аватара (опционально)
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        width: "200px",
        fontSize: "14px",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", textAlign: "center" }}>Lobby Players</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((player) => (
          <li
            key={player.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {player.avatarUrl && (
              <img
                src={player.avatarUrl}
                alt={player.name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
            )}
            <span>{player.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
