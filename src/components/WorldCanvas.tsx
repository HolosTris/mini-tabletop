import React, {
  DragEvent,
  DragEventHandler,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Container,
  Sprite,
  useApp,
  TilingSprite,
  Graphics,
  _ReactPixi,
} from "@pixi/react";
import * as PIXI from "pixi.js";
import "./WorldCanvas.css";
import Object, { IObject } from "./Object";
import { ICard, IGame } from "../interfaces";

const WorldCanvas: React.FC = () => {
  const [cardTexture, setCardTexture] = useState<PIXI.Texture | null>(null);
  // const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  // const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  // const [cursor, setCursor] = useState<string>("move");

  const worldRef = useRef<PIXI.Container>(null);
  const [objects, setObjects] = useState<IObject[]>([]);

  const objectRef = useRef<PIXI.Sprite>(null);
  let object = objectRef.current;
  // const [object, setObject] = useState<PIXI.Sprite>();
  const isDragging = useRef(false);
  const previousPosition = useRef({ x: 0, y: 0 });
  const shift = useRef({ x: 0, y: 0 });

  const onDragStart = (e: PIXI.FederatedPointerEvent) => {
    console.log(e.target);
    console.log(e.currentTarget);

    if (e.currentTarget == e.target || e.button != 0) {
      if (worldRef.current) isDragging.current = true;
      previousPosition.current = { x: e.clientX, y: e.clientY };
    } else if (e.target.interactive) {
      isDragging.current = true;
      object = e.target as PIXI.Sprite;

      object.zIndex = 1;

      const bounds = object.getBounds();
      shift.current = {
        x: e.globalX - bounds.x - object.anchor.x * bounds.width,
        y: e.globalY - bounds.y - object.anchor.y * bounds.height,
      };
    }
  };

  const onDragEnd = () => {
    isDragging.current = false;
    if (object) object.zIndex = 0;
    object = null;
    // setObject(undefined);
  };

  const [cellWidth, cellHeight] = [450, 700];
  const snapping = 0.5;

  const onDragMove = (e: PIXI.FederatedPointerEvent) => {
    if (isDragging.current && worldRef.current && !object) {
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
    } else if (object) {
      console.log(worldRef.current?.scale);

      // const scaledCell = [
      //   cellWidth * worldRef.current?.scale.x,
      //   cellHeight * worldRef.current?.scale.y,
      // ];
      // const globalPosition = {
      //   x:
      //     Math.round((e.globalX - shift.current.x) / scaledCell[0]) *
      //     scaledCell[0],
      //   y:
      //     Math.round((e.globalY - shift.current.y) / scaledCell[1]) *
      //     scaledCell[1],
      // };

      object.parent.toLocal(
        // globalPosition,
        { x: e.globalX - shift.current.x, y: e.globalY - shift.current.y },
        undefined,
        object.position
      );

      object.position = snap(object.position);
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

  // const handleMouseDown = (e: PointerEvent) => {
  //   if (worldRef.current) isDragging.current = true;
  //   previousPosition.current = { x: e.clientX, y: e.clientY };
  // };

  // const handleMouseUp = () => {
  //   isDragging.current = false;
  // };

  // const handleMouseMove = (e: PointerEvent) => {
  //   if (isDragging.current && worldRef.current) {
  //     const dx = e.clientX - previousPosition.current.x;
  //     const dy = e.clientY - previousPosition.current.y;

  //     worldRef.current.x += dx;
  //     worldRef.current.y += dy;

  //     previousPosition.current = { x: e.clientX, y: e.clientY };
  //   }
  // };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (!worldRef.current) return;

    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const mousePosition = { x: e.clientX, y: e.clientY };

    const localPos = {
      x: (mousePosition.x - worldRef.current.x) / worldRef.current.scale.x,
      y: (mousePosition.y - worldRef.current.y) / worldRef.current.scale.y,
    };

    if (
      (worldRef.current.scale.x > 0.05 && scaleFactor < 1) ||
      (worldRef.current.scale.x < 1 && scaleFactor > 1)
    ) {
      worldRef.current.scale.x *= scaleFactor;
      worldRef.current.scale.y *= scaleFactor;
    }

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
  const cards: IObject[] = Array.from({ length: 10 }).map((_, i) =>
    // <Object
    //   key={i}
    //   texture={cardTexture!}
    //   x={Math.random() * worldSize}
    //   y={Math.random() * worldSize}
    //   // scale={0.5}
    //   anchor={0.5}
    // />
    ({
      id: i,
      texture: PIXI.Texture.from("src/assets/Card 6.png"),
      x: Math.random() * worldSize,
      y: Math.random() * worldSize,
      // scale={0.5}
      anchor: 0.5,
    })
  );
  // useEffect(() => {
  //   setObjects((prevObjs) => [...prevObjs, ...cards]);
  //   console.log("render");
  // }, []);
  // const grid = Array.from({ length: 100 }).map((_, i) => (
  //   <TilingSprite
  //     key={i}
  //     texture={cardTexture!}
  //     x={Math.random() * worldSize}
  //     y={Math.random() * worldSize}
  //     scale={0.5}
  //     anchor={0.5}
  //   />
  // ));

  // useEffect(() => {
  //   setCursor("move");
  // }, []);

  // utils

  function snap(pos: PIXI.IPoint) {
    if (
      Math.abs((pos.x % cellWidth) - cellWidth / 2) >
        (cellWidth / 2) * (1 - snapping) &&
      Math.abs((pos.y % cellHeight) - cellHeight / 2) >
        (cellHeight / 2) * (1 - snapping)
    )
      pos = {
        x: Math.round(pos.x / cellWidth) * cellWidth,
        y: Math.round(pos.y / cellHeight) * cellHeight,
      };
    console.log(pos);

    return pos;
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  function onDrop(e: DragEvent) {
    if (e.dataTransfer?.getData("value") == "mafia")
      (async () => {
        const mafiaCards: ICard[] = (
          await ((await fetch("src/mafia.json")).json() as Promise<IGame>)
        ).cards;

        const startPosition = snap(
          worldRef.current!.toLocal({ x: e.clientX, y: e.clientY })
        );
        const cardSet: IObject[] = [];

        for (let i = 0; i <= 5; i++)
          cardSet.push({
            id: Date.now() + i,
            x: startPosition.x + 40 * i,
            y: startPosition.y,
            texture: PIXI.Texture.from(mafiaCards[i].src[0]),
            anchor: 0.5,
          });

        setObjects((prevObjs) => [...prevObjs, ...cardSet]);
      })();
    console.log(objects);
  }

  return (
    <Stage
      height={window.innerHeight}
      width={window.innerWidth}
      options={{ backgroundColor: 0x111133, resizeTo: document.body }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      // style={{ cursor: cursor }}
      // ref={stageRef}
      // onPointerDown={(e) => handleMouseDown(e)}
      // onPointerMove={(e) => handleMouseMove(e)}
      // onPointerUp={() => handleMouseUp()}
      // onPointerOut={() => handleMouseUp()}
    >
      <Container
        ref={worldRef}
        interactive
        sortableChildren
        hitArea={new PIXI.Rectangle(-5000000, -5000000, 10000000, 10000000)}
        scale={worldRef.current?.scale || 0.2}
        position={worldRef.current?.position}
        pointerdown={onDragStart}
        pointermove={onDragMove}
        pointerup={onDragEnd}
        pointerupoutside={onDragEnd}
        // pointerdown={handleMouseDown}
        // pointerup={handleMouseUp}
        // pointerupoutside={handleMouseUp}
        // pointermove={handleMouseMove}
        cursor="move"
      >
        {/* <TilingSprite // Board
          position={{ x: -5000000, y: -5000000 }}
          tilePosition={{ x: 0, y: 0 }}
          // texture={PIXI.Texture.from("src/assets/Card_Tile.png")}
          image={"src/assets/Board_Tile_1.png"}
          // scale={0.5}
          // anchor={0.5}
          height={10000000}
          width={10000000}
          tileScale={{ x: 1, y: 1 }}
        /> */}
        <TilingSprite // Grid
          position={{ x: -5000000, y: -5000000 }}
          tilePosition={{ x: 5000000 - 450 / 2, y: 5000000 - 700 / 2 }}
          texture={PIXI.Texture.from("src/assets/Card_Tile.png")}
          // image={"src/assets/Card_Tile.png"}
          // scale={0.5}
          // anchor={0.5}
          height={10000000}
          width={10000000}
          tileScale={{ x: 1, y: 1 }}
        />
        {objects.map((obj) => (
          <Object key={obj.id} {...obj} />
        ))}
        {/* {cardTexture && cards} */}
        <Sprite
          texture={PIXI.Texture.from("src/assets/Card 10.png")}
          x={0}
          y={0}
          // scale={0.5}
          anchor={0.5}
        />
      </Container>
    </Stage>
  );
};

export default WorldCanvas;
