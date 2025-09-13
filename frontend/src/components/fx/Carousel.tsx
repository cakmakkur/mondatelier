import { useState, useEffect, useRef } from "react";

interface CarouselPropTypes {
  imgUrls: string[];
}

export default function Carousel({ imgUrls }: CarouselPropTypes) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const [reversed, setReversed] = useState(false);

  useEffect(() => {
    startSlide();
    return () => clearInterval(intervalRef.current);
    // run once on mount (and if imgUrls length changes)
  }, [imgUrls.length]);

  const startSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current === imgUrls.length - 1) {
          setReversed(true);
          return current - 1;
        } else if (current === 0) {
          setReversed(false);
          return current + 1;
        } else {
          return current + (reversed ? -1 : 1);
        }
      });
    }, 5000);
  };

  const stopSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (sliderRef.current) {
      const newTranslate = activeIndex * -100;
      sliderRef.current.style.transform = `translateX(${newTranslate}%)`;
    }
  }, [activeIndex]);

  const prevSlide = () => {
    const prevIndex = (activeIndex - 1 + imgUrls.length) % imgUrls.length;
    setActiveIndex(prevIndex);
  };

  const nextSlide = () => {
    const nextIndex = (activeIndex + 1) % imgUrls.length;
    setActiveIndex(nextIndex);
  };

  return (
    <div
      onMouseEnter={stopSlide}
      onMouseLeave={startSlide}
      className="carousel_slider_container"
    >
      <div
        ref={sliderRef}
        style={{ transition: "transform 1s ease-out", display: "flex" }}
      >
        {imgUrls.map((url, index) => (
          <img key={index} src={url} alt={`Slide ${index + 1}`} />
        ))}
      </div>
      <button
        disabled={activeIndex === 0}
        onClick={prevSlide}
        className="carousel_prev_btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            fill="white"
            d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"
          />
        </svg>
      </button>
      <button
        disabled={activeIndex === imgUrls.length - 1}
        onClick={nextSlide}
        className="carousel_next_btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            fill="white"
            d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"
          />
        </svg>
      </button>
    </div>
  );
}
