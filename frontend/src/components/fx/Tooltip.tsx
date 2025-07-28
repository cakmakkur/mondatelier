import { useEffect, useRef } from "react";

interface TooltipProp {
  text: string;
  tooltipPosition: "top" | "bottom";
}

export default function ToolTip({ text, tooltipPosition }: TooltipProp) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapperRef.current!.style.opacity = "1";
    console.log(tooltipPosition);
    if (tooltipPosition === "top") {
      bottomRef.current!.style.opacity = "1";
      wrapperRef.current!.style.top = "0";
      wrapperRef.current!.style.marginTop = "-50px";
    } else if (tooltipPosition === "bottom") {
      topRef.current!.style.opacity = "1";
      wrapperRef.current!.style.bottom = "0";
      wrapperRef.current!.style.marginBottom = "-50px";
    }
  }, [tooltipPosition]);

  return (
    <div ref={wrapperRef} className="tooltip_wrapper">
      <div ref={mainRef} className="tooltip_main">
        <div ref={topRef} className="tooltip_top"></div>
        <span>{text}</span>
        <div ref={bottomRef} className="tooltip_bottom"></div>
      </div>
    </div>
  );
}
