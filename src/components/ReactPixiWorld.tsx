import React, { useEffect, useRef, useState } from "react";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";
// dfdfdf
const ReactPixiWorld: React.FC = () => {
  const [treeTexture, setTreeTexture] = useState<PIXI.Texture | null>(null);
  // const [appView, setAppView] = useState<PIXI.ICanvas | null>(null);
  // const stageRef = useRef<PIXI.Application>(null);
  const worldRef = useRef<PIXI.Container>(null);
  const isDragging = useRef(false);
  const previousPosition = useRef({ x: 0, y: 0 });

  const app = useApp();
  const appView = useRef<PIXI.ICanvas>(app.view);

  // useEffect(() => {
  //   setAppView(app.view);
  // }, [app.view]);

  // Load the tree texture and set it to state
  useEffect(() => {
    (async () => {
      const texture = await PIXI.Assets.load(
        "https://pixijs.com/assets/tree.png"
      );
      setTreeTexture(texture);
    })();
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    previousPosition.current = { x: e.clientX, y: e.clientY };
    console.log(previousPosition.current);
    console.log(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isDragging.current = false;
    console.log(previousPosition.current);
    console.log(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && worldRef.current) {
      const dx = e.clientX - previousPosition.current.x;
      const dy = e.clientY - previousPosition.current.y;

      worldRef.current.x += dx;
      worldRef.current.y += dy;

      previousPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (!worldRef.current) return;

    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const mousePosition = { x: e.clientX, y: e.clientY };

    const localPos = {
      x: (mousePosition.x - worldRef.current.x) / worldRef.current.scale.x,
      y: (mousePosition.y - worldRef.current.y) / worldRef.current.scale.y,
    };

    worldRef.current.scale.x *= scaleFactor;
    worldRef.current.scale.y *= scaleFactor;

    worldRef.current.x =
      mousePosition.x - localPos.x * worldRef.current.scale.x;
    worldRef.current.y =
      mousePosition.y - localPos.y * worldRef.current.scale.y;
  };

  // Event handlers for drag and zoom
  useEffect(() => {
    // Ensure app.view is available
    // const appView = app.view;

    // Add event listeners only if appView is defined
    // if (appView) {
    // app.stage.addEventListener("mousedown", handleMouseDown as EventListener);
    // window.addEventListener("mouseup", handleMouseUp);
    // app.stage.addEventListener("mousemove", handleMouseMove as EventListener);
    // app.stage.addEventListener("wheel", handleWheel);
    // // }

    window.addEventListener("wheel", handleWheel);
    // Cleanup event listeners
    return () => {
      window.removeEventListener("wheel", handleWheel);

      // if (appView) {
      // app.stage.removeEventListener(
      //   "mousedown",
      //   handleMouseDown as EventListener
      // );
      // window.removeEventListener("mouseup", handleMouseUp);
      // app.stage.removeEventListener(
      //   "mousemove",
      //   handleMouseMove as EventListener
      // );
      // app.stage.removeEventListener("wheel", handleWheel);
      // }
    };
  }, [app]);

  // Render 10,000 trees in random positions
  const worldSize = 5000;
  const trees = Array.from({ length: 10000 }).map((_, i) => (
    <Sprite
      key={i}
      texture={treeTexture!}
      x={Math.random() * worldSize}
      y={Math.random() * worldSize}
      scale={0.25}
      anchor={0.5}
    />
  ));

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ backgroundColor: 0x111133, resizeTo: window }}
      // ref={stageRef}
    >
      <Container
        ref={worldRef}
        interactive={true}
        hitArea={new PIXI.Rectangle(-5000000, -5000000, 10000000, 10000000)}
        pointerdown={handleMouseDown}
        pointerup={handleMouseUp}
        pointerupoutside={handleMouseUp}
        pointermove={handleMouseMove}
      >
        {treeTexture && trees}
      </Container>
    </Stage>
  );
};

export default ReactPixiWorld;
