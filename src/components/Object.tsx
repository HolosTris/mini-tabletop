import React, { useRef } from "react";
import PropTypes from "prop-types";
import { _ReactPixi, InteractionEvents, Sprite, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";

function Object(props: _ReactPixi.ISprite) {
  const app = useApp();

  const objectRef = useRef<PIXI.Sprite>(null);
  const isDragging = useRef(false);
  const previousPosition = useRef({ x: 0, y: 0 });

  const onDragStart = (e: PIXI.FederatedPointerEvent) => {
    console.log(e.target);

    isDragging.current = true;
    previousPosition.current = { x: e.clientX, y: e.clientY };
  };

  const onDragEnd = () => {
    isDragging.current = false;
  };

  const onDragMove = (e: PIXI.FederatedPointerEvent) => {
    if (isDragging.current && objectRef.current) {
      // const dx = e.clientX - previousPosition.current.x;
      // const dy = e.clientY - previousPosition.current.y;

      // objectRef.current.x += dx;
      // objectRef.current.y += dy;

      objectRef.current.parent.toLocal(
        e.global,
        undefined,
        objectRef.current.position
      );
      console.log("move");

      // previousPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  // app.stage.on("pointermove", onDragMove);
  // app.stage.on("pointerup", onDragEnd);
  // app.stage.on("pointerout", onDragEnd);

  return (
    <Sprite
      ref={objectRef}
      cursor="pointer"
      interactive={true}
      // pointerdown={onDragStart}
      // pointermove={onDragMove}
      // pointerup={onDragEnd}
      {...props}
    />
  );
}

export default Object;
