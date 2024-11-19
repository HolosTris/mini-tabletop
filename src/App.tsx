import { useState, useMemo, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { Application, BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text, AppProvider } from "@pixi/react";
import FullscreenCanvas from "./components/FullscreenCanvas";
import WorldContainer from "./components/WorldContainer";
import ReactPixiWorld from "./components/ReactPixiWorld";
import GameField from "./components/ui/GameField";
import WorldCanvas from "./components/WorldCanvas";

const App = () => {
  const stageRef = useRef<Stage | null>(null);

  const blurFilter = useMemo(() => new BlurFilter(2), []);
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

  const app = new Application({
    backgroundColor: 0x111133, // Set the background color
    resizeTo: window, // Automatically resize to window
  });

  return (
    <AppProvider value={app}>
      <GameField/>
      <ReactPixiWorld />
      <WorldCanvas />
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
