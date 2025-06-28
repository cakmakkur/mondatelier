import { useEffect, useRef } from "react";

interface NavBarProps {
  startFadeIn: boolean;
}
export default function NavBar({ startFadeIn }: NavBarProps) {
  const navBarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navBarRef.current) return;

    if (startFadeIn) {
      timeoutRef.current = setTimeout(() => {
        navBarRef.current!.style.opacity = "1";
      }, 2000);
    } else {
      navBarRef.current!.style.opacity = "0";
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startFadeIn]);

  return (
    <div ref={navBarRef} className="navBar">
      <a className="navBar_nav" href="#">
        We
      </a>
      <a className="navBar_nav" href="#">
        Gallery
      </a>
      <a className="navBar_nav" href="#">
        Contact
      </a>
    </div>
  );
}
