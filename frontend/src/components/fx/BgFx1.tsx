import { useEffect, useRef } from "react";
// @ts-expect-error importing canvas class
import Effect2 from "../../assets/visual_effects/sec7_canvas_2.js";

export default function BgFx1() {
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const sectionDivRef = useRef<HTMLDivElement>(null);
  const effectRef2 = useRef<Effect2>(null);

  useEffect(() => {
    effectRef2.current?.stop();

    // canvas 2 --- background
    if (canvasRef2.current) {
      const canvas2 = canvasRef2.current;
      const ctx2 = canvas2.getContext("2d");
      canvas2.width = window.innerWidth;
      canvas2.height = window.innerHeight;
      effectRef2.current = new Effect2(ctx2, canvas2.width, canvas2.height);
      effectRef2.current.animate();
    }
  }, []);

  return (
    <div ref={sectionDivRef} className="section_7">
      <canvas ref={canvasRef2} className="section_7__canvas_2"></canvas>
    </div>
  );
}
