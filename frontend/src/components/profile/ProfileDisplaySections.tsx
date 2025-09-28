import { useEffect, useRef, useState } from "react";

interface ProfileDisplaySectionsProps {
  setSection: (section: string) => void;
}

export default function ProfileDisplaySections({
  setSection,
}: ProfileDisplaySectionsProps) {
  const highlight = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  const [buttonWidths, setButtonWidths] = useState<number[]>([]);
  const [focusPosition, setFocusPosition] = useState<number>(0);

  const handleClick = (newSection: string, index: number) => {
    setSection(newSection);
    setFocusPosition(index);
  };

  useEffect(() => {
    const widths = buttonRefs.current.map((ref) =>
      ref ? ref.getBoundingClientRect().width : 0
    );
    setButtonWidths(widths);
  }, []);

  useEffect(() => {
    if (!highlight.current || buttonWidths.length === 0) return;

    const offset = buttonWidths
      .slice(0, focusPosition)
      .reduce((acc, w) => acc + w + 20, 0); // 20px spacing

    highlight.current.style.width = `${buttonWidths[focusPosition]}px`;
    highlight.current.style.transform = `translateX(${offset}px)`;
  }, [focusPosition, buttonWidths]);

  return (
    <div className="display_nav">
      <span ref={highlight} className="display_nav--highlight"></span>
      {[
        "About",
        "Art",
        "Collections",
        "Masterclasses",
        "Events",
        "Freelance",
        "Liked",
      ].map((label, i) => (
        <button
          key={label}
          ref={(el: HTMLButtonElement | null) => {
            if (el) buttonRefs.current[i] = el;
          }}
          style={focusPosition === i ? { color: "white" } : {}}
          onClick={() => handleClick(label.toLowerCase(), i)}
        >
          {["Liked"].includes(label) ? (
            <span style={{ fontSize: "1rem" }}>{label}</span>
          ) : (
            label
          )}
        </button>
      ))}
    </div>
  );
}
