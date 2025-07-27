import { useEffect, useRef } from "react";
// @ts-expect-error importing canvas class
import FlowFieldEffect from "./effect2.js";

export default function BgFx1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<FlowFieldEffect>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx2 = canvas.getContext("2d");
      if (!ctx2) return;
      canvas.width = 800;
      canvas.height = 500;
      const effect = new FlowFieldEffect(ctx2, canvas.width, canvas.height);
      effectRef.current = effect;

      requestAnimationFrame(effect.animate.bind(effect));
    }
  }, []);

  return <canvas ref={canvasRef} className="canvas_2"></canvas>;
}
