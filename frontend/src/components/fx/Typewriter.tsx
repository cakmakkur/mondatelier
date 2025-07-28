import { useState, useEffect } from "react";

type PropTypes = {
  text: string;
  speed?: number;
};

export default function Typewriter({ text, speed = 50 }: PropTypes) {
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setCurrentText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (index < text.length + 10) {
      const timeoutId = setTimeout(() => {
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else if (index < text.length * 2 + 10) {
      const timeoutId = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      const timeoutId = setTimeout(() => {
        setCurrentText("");
        setIndex(0);
      }, speed + 600);
      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  return (
    <div style={{ height: "30px" }}>
      <h2 className="typewriter">{currentText}</h2>
    </div>
  );
}
