import { useEffect, useRef } from "react";
// @ts-expect-error importing canvas class
import FlowFieldEffect from "./effect3.js";

export default function BgFx3() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<FlowFieldEffect>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effectRef.current = new FlowFieldEffect(ctx, canvas.width, canvas.height);
      effectRef.current.animationFrameId = requestAnimationFrame((ts) =>
        effectRef.current?.animate(ts)
      );
    }

    return () => effectRef.current?.stop();
  }, []);

  return (
    <div ref={divRef} className="canvas_3_wrapper">
      <canvas ref={canvasRef} className="canvas_1"></canvas>
    </div>
  );
}
