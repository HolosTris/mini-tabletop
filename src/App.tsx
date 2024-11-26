import { useState, useMemo, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Application, BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text, AppProvider } from "@pixi/react";
import ReactPixiWorld from "./components/ReactPixiWorld";
import MenuPanel from "./components/ui/MenuPanel";
import WorldCanvas from "./components/WorldCanvas";
import PlayerList from "./components/ui/PlayerList";

const App = () => {
  const stageRef = useRef<Stage | null>(null);

  const blurFilter = useMemo(() => new BlurFilter(2), []);
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

  const app = new Application({
    backgroundColor: 0x111133, // Set the background color
    resizeTo: window, // Automatically resize to window
  });

  const [players, setPlayers] = useState([
    { id: "1", name: "Player 1", avatarUrl: "https://example.com/avatar1.png" },
    { id: "2", name: "Player 2", avatarUrl: "https://example.com/avatar2.png" },
    { id: "3", name: "Player 3" }, // Без аватара
  ]);
  
  return (
    <AppProvider value={app}>
    <PlayerList players={players} />
      <WorldCanvas />
      <MenuPanel />
    </AppProvider>
    // <Stage
    //   ref={stageRef}
    //   width={window.innerWidth}
    //   height={window.innerHeight}
    //   options={{ background: 0x111133 }}
    // >
    //   <WorldContainer stageRef={stageRef} />
    // </Stage>
  );
};

export default App;