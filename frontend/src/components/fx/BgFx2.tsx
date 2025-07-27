import { useEffect, useRef } from "react";
// @ts-expect-error importing canvas class
import FlowFieldEffect from "../../assets/visual_effects/effect2.js";

export default function BgFx1() {
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const effectRef2 = useRef<FlowFieldEffect>(null);

  useEffect(() => {
    effectRef2.current?.stop();

    if (canvasRef2.current) {
      const canvas2 = canvasRef2.current;
      const ctx2 = canvas2.getContext("2d");
      if (!ctx2) return;
      canvas2.width = window.innerWidth / 2;
      canvas2.height = window.innerHeight / 2;
      effectRef2.current = new FlowFieldEffect(
        ctx2,
        canvas2.width,
        canvas2.height
      );

      effectRef2.current.animate();
    }
  }, []);

  return <canvas ref={canvasRef2} className="canvas_2"></canvas>;
}
