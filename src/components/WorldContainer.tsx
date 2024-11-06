//dsf
// import { Application, Assets, Container, Sprite } from "pixi.js";

import React, { RefObject, useEffect, useRef } from "react";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import { Application } from "pixi.js";

const WorldContainer: React.FC<RefObject<Stage>> = (
  stageRef: RefObject<Stage>
) => {
  // const app = new Application();
  const stage = stageRef.current;
  // appRef.current = app;

  useEffect(() => {
    // Panning support
    let isDragging = false;
    const previousPosition = { x: 0, y: 0 };

    stage?.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousPosition.x = e.clientX;
      previousPosition.y = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    app.canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const dx = e.clientX - previousPosition.x;
        const dy = e.clientY - previousPosition.y;

        worldContainer.x += dx;
        worldContainer.y += dy;

        previousPosition.x = e.clientX;
        previousPosition.y = e.clientY;
      }
    });

    // Zoom support centered on the mouse position
    app.canvas.addEventListener("wheel", (e) => {
      e.preventDefault(); // Prevent the page from scrolling

      const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9; // Adjusting the zoom speed
      const mousePosition = { x: e.clientX, y: e.clientY };

      // Convert mouse position to the world container's local space
      const localPos = {
        x: (mousePosition.x - worldContainer.x) / worldContainer.scale.x,
        y: (mousePosition.y - worldContainer.y) / worldContainer.scale.y,
      };

      // Apply scale factor
      worldContainer.scale.x *= scaleFactor;
      worldContainer.scale.y *= scaleFactor;

      // Adjust container position based on new scale
      worldContainer.x = mousePosition.x - localPos.x * worldContainer.scale.x;
      worldContainer.y = mousePosition.y - localPos.y * worldContainer.scale.y;
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      app.destroy(true, true);
    };
  }, []);

  return (
    <Container isRenderGroup={true}>
      <Sprite image={bunnyUrl} x={300} y={150} />
      <Sprite image={bunnyUrl} x={500} y={150} />
      <Sprite image={bunnyUrl} x={400} y={200} />
      <Container x={200} y={200}>
        <Text
          text="Hello World"
          anchor={0.5}
          x={220}
          y={150}
          // filters={[blurFilter]}
          style={
            new TextStyle({
              align: "center",
              fill: "#ffffff",
              fontSize: 50,
              letterSpacing: 20,
              dropShadow: true,
              dropShadowColor: "#E72264",
              dropShadowDistance: 6,
            })
          }
        />
      </Container>
    </Container>
  );
};

export default WorldContainer;

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    backgroundColor: "brown",
    resizeTo: window,
  });

  const treeTexture = await Assets.load(`https://pixijs.com/assets/tree.png`);

  const worldContainer = new Container({
    // this will make moving this container GPU powered
    isRenderGroup: true,
  });

  const worldSize = 5000;

  for (let i = 0; i < 10000; i++) {
    const yPos = Math.random() * worldSize;

    const tree = new Sprite({
      texture: treeTexture,
      x: Math.random() * worldSize,
      y: yPos,
      scale: 0.25,
      anchor: 0.5,
    });

    worldContainer.addChild(tree);
  }

  // sort the trees by their y position
  worldContainer.children.sort((a, b) => a.position.y - b.position.y);

  app.stage.addChild(worldContainer);

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // Panning support
  let isDragging = false;
  let previousPosition = { x: 0, y: 0 };

  app.canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousPosition.x = e.clientX;
    previousPosition.y = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  app.canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - previousPosition.x;
      const dy = e.clientY - previousPosition.y;

      worldContainer.x += dx;
      worldContainer.y += dy;

      previousPosition.x = e.clientX;
      previousPosition.y = e.clientY;
    }
  });

  // Zoom support centered on the mouse position
  app.canvas.addEventListener("wheel", (e) => {
    e.preventDefault(); // Prevent the page from scrolling

    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9; // Adjusting the zoom speed
    const mousePosition = { x: e.clientX, y: e.clientY };

    // Convert mouse position to the world container's local space
    const localPos = {
      x: (mousePosition.x - worldContainer.x) / worldContainer.scale.x,
      y: (mousePosition.y - worldContainer.y) / worldContainer.scale.y,
    };

    // Apply scale factor
    worldContainer.scale.x *= scaleFactor;
    worldContainer.scale.y *= scaleFactor;

    // Adjust container position based on new scale
    worldContainer.x = mousePosition.x - localPos.x * worldContainer.scale.x;
    worldContainer.y = mousePosition.y - localPos.y * worldContainer.scale.y;
  });
})();
//wefwef
