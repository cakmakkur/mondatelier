import { useState, useEffect, useRef } from "react";

interface CarouselPropTypes {
  imgUrls: string[];
}

export default function Carousel({ imgUrls }: CarouselPropTypes) {
  // const [imgUrls, setImgUrls] = useState(["/events_poster_2.png"]);
  const extendedImgUrls = [...imgUrls, imgUrls[0]];

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    startSlide();
    return () => clearInterval(intervalRef.current);
  });

  const startSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => {
        if (activeIndex === extendedImgUrls.length - 1 && sliderRef.current) {
          sliderRef.current.style.transition = "none";
          requestAnimationFrame(() => {
            const newTranslate = 0;
            if (sliderRef.current) {
              sliderRef.current.style.transform = `translateX(${newTranslate}vw)`;
              requestAnimationFrame(() => {
                if (sliderRef.current) {
                  sliderRef.current.style.transition = "transform 1s ease-out";
                }
              });
            }
          });
          return 0;
        } else {
          return current + 1;
        }
      });
    }, 10000);
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
    const prevIndex = (activeIndex - 1) % imgUrls.length;
    setActiveIndex(prevIndex);
  };
  const nextSlide = () => {
    const nextIndex = (activeIndex + 1) % imgUrls.length;
    setActiveIndex(nextIndex);
  };

  return (
    <div
      onMouseEnter={stopSlide}
      onMouseLeave={() => startSlide()}
      className="carousel_slider_container"
    >
      <div ref={sliderRef} style={{ transition: "transform 1s ease-out" }}>
        {extendedImgUrls.map((url, index) => (
          <img key={index} src={imgUrls[index]} alt={`Slide ${index + 1}`} />
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
        disabled={activeIndex === 4}
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
