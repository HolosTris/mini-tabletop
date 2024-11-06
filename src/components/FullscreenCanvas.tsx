import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

const FullscreenCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    // Initialize Pixi Application
    const app = new PIXI.Application({
      resizeTo: window, // Automatically resize to fit the window
      backgroundColor: 0x1099bb,
    });
    appRef.current = app;

    // Append the canvas to the container div
    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view as HTMLCanvasElement);
    }

    // Resize handler to make canvas fullscreen
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Initial resize to fullscreen
    handleResize();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      app.destroy(true, true);
    };
  }, []);

  return <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default FullscreenCanvas;
