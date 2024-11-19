import React, { PointerEvent, useEffect, useRef, useState } from "react";
import {
  Stage,
  Container,
  Sprite,
  useApp,
  InteractionEvents,
  InteractionEventTypes,
} from "@pixi/react";
import * as PIXI from "pixi.js";
import "./WorldCanvas.css";
import Object from "./Object";

const WorldCanvas: React.FC = () => {
  const [cardTexture, setCardTexture] = useState<PIXI.Texture | null>(null);
  // const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  // const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [cursor, setCursor] = useState<string>("move");

  const worldRef = useRef<PIXI.Container>(null);
  const objectRef = useRef<PIXI.Sprite>(null);
  const isDragging = useRef(false);
  const previousPosition = useRef({ x: 0, y: 0 });

  const onDragStart = (e: PIXI.FederatedPointerEvent) => {
    console.log(e.target);
    console.log(e.currentTarget);

    if (e.currentTarget == e.target) {
      if (worldRef.current) isDragging.current = true;
      previousPosition.current = { x: e.clientX, y: e.clientY };
    } else {
      isDragging.current = true;
      objectRef.current = e.target;
      // previousPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onDragEnd = () => {
    isDragging.current = false;
  };

  const onDragMove = (e: PIXI.FederatedPointerEvent) => {
    if (isDragging.current && worldRef.current && e.currentTarget == e.target) {
      const dx = e.clientX - previousPosition.current.x;
      const dy = e.clientY - previousPosition.current.y;

      worldRef.current.x += dx;
      worldRef.current.y += dy;

      previousPosition.current = { x: e.clientX, y: e.clientY };

      // worldRef.current.parent.toLocal(
      //   e.global,
      //   undefined,
      //   worldRef.current.position
      // );
    }
    if (isDragging.current && objectRef.current) {
      objectRef.current.parent.toLocal(
        e.global,
        undefined,
        objectRef.current.position
      );
      console.log("move");
    }
  };

  const app = useApp();

  // Load the tree texture and set it to state
  useEffect(() => {
    // (async () => {
    //   const texture = await PIXI.Assets.load("../assets/Card 6.png");
    //   setCardTexture(texture);
    // })();

    setCardTexture(PIXI.Texture.from("src/assets/Card 6.png"));
  }, []);

  const handleMouseDown = (e: PointerEvent) => {
    if (worldRef.current) isDragging.current = true;
    previousPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: PointerEvent) => {
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
    window.addEventListener("wheel", handleWheel, { passive: false });
    // Cleanup event listeners
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [app]);

  // Render 10,000 trees in random positions
  const worldSize = 5000;
  const cards = Array.from({ length: 100 }).map((_, i) => (
    <Object
      key={i}
      texture={cardTexture!}
      x={Math.random() * worldSize}
      y={Math.random() * worldSize}
      scale={0.5}
      anchor={0.5}
    />
  ));

  // useEffect(() => {
  //   setCursor("move");
  // }, []);

  return (
    <Stage
      height={window.innerHeight}
      width={window.innerWidth}
      options={{ backgroundColor: 0x111133, resizeTo: document.body }}
      style={{ cursor: cursor }}
      // ref={stageRef}
      // onPointerDown={(e) => handleMouseDown(e)}
      // onPointerMove={(e) => handleMouseMove(e)}
      // onPointerUp={() => handleMouseUp()}
      // onPointerOut={() => handleMouseUp()}
    >
      <Container
        ref={worldRef}
        interactive={true}
        hitArea={new PIXI.Rectangle(-5000000, -5000000, 10000000, 10000000)}
        pointerdown={onDragStart}
        pointermove={onDragMove}
        pointerup={onDragEnd}
        // pointerupoutside={onDragEnd}
        // pointerdown={handleMouseDown}
        // pointerup={handleMouseUp}
        // pointerupoutside={handleMouseUp}
        // pointermove={handleMouseMove}
        cursor="move"
      >
        {cardTexture && cards}
      </Container>
    </Stage>
  );
};

export default WorldCanvas;
