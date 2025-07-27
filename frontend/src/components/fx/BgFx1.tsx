import { useEffect, useRef } from "react";
// @ts-expect-error importing canvas class
import Effect from "./effect1.js";

export default function BgFx1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionDivRef = useRef<HTMLDivElement>(null);
  const effectRef2 = useRef<Effect>(null);

  useEffect(() => {
    effectRef2.current?.stop();

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effectRef2.current = new Effect(ctx, canvas.width, canvas.height);
      effectRef2.current.animate();
    }
  }, []);

  return (
    <div ref={sectionDivRef} className="canvas_1_wrapper">
      <canvas ref={canvasRef} className="canvas_1"></canvas>
    </div>
  );
}
