import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// @ts-expect-error importing THREE.js assets
import * as THREE from "three";
// @ts-expect-error importing THREE.js assets
import { moon, anchor } from "../assets/homepage_canvas_components.js";
// import Clock from "../components/Clock";
// @ts-expect-error importing canvas class
import Effect from "../effects/homepage_moon_canvas.js";
import NavBar from "../components/Navbar.js";

export default function Homepage() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [startFadeIn, setStartFadeIn] = useState(false);
  const modalDivRef = useRef<HTMLDivElement>(null);

  const timeoutRef2 = useRef<number | null>(null);
  const timeoutRef3 = useRef<number | null>(null);

  const canvasRef_2 = useRef<HTMLCanvasElement>(null);
  const canvasRef_3 = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const effectRef = useRef<Effect>(null);
  const stars = useRef<THREE.Mesh[]>([]);
  const phaseOffsets = useRef<number[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleLoad() {
      setIsPageLoaded(true);
    }
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!modalDivRef.current || !isPageLoaded) return;
    modalDivRef.current.style.opacity = "0";
    timeoutRef3.current = setTimeout(() => {
      setStartAnimation(true);
      setStartFadeIn(true);
    }, 300);
    return () => {
      if (timeoutRef3.current) clearTimeout(timeoutRef3.current);
    };
  }, [isPageLoaded]);

  useEffect(() => {
    if (!footerRef.current || !startFadeIn) return;
    timeoutRef2.current = setTimeout(() => {
      footerRef.current!.style.opacity = "1";
    }, 2000);
  }, [startFadeIn]);

  useEffect(() => {
    if (!canvasRef_2.current) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef_2.current!,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("black");
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 10);
    scene.add(directionalLight);

    // ----- CAMERA -----
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 30);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // ----- MOON -----
    scene.add(moon);

    // ----- ANCHOR OBJECT -----

    scene.add(anchor);

    // ----- STARS -----
    const addStars = (xRange: number[], yRange: number[], zRange: number[]) => {
      const geometry = new THREE.SphereGeometry(0.05, 24, 24);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      const x = THREE.MathUtils.randFloat(xRange[0], xRange[1]);
      const y = THREE.MathUtils.randFloat(yRange[0], yRange[1]);
      const z = THREE.MathUtils.randFloat(zRange[0], zRange[1]);

      phaseOffsets.current.push(Math.random() * Math.PI * 2);
      stars.current.push(star);
      star.position.set(x, y, z);
      anchor.add(star);
    };
    const xRange = [-100, 100];
    const yRange = [-40, 40];
    const zRange = [-110, 110];

    Array(600)
      .fill(null)
      .forEach(() => addStars(xRange, yRange, zRange));

    // ----- ANIMATE -----
    const clock = new THREE.Clock();
    function animate() {
      const elapsedTime = clock.getElapsedTime();

      stars.current.forEach((star, i) => {
        star.scale.set(
          0.5 + Math.abs(Math.sin(elapsedTime + phaseOffsets.current[i])),
          0.5 + Math.abs(Math.sin(elapsedTime + phaseOffsets.current[i])),
          0.5 + Math.abs(Math.sin(elapsedTime + phaseOffsets.current[i]))
        );
      });
      // stars rotating around invisible anchor element at (0, 0, 0)
      anchor.rotation.y += 0.0001;

      // moon is lit based on scroll position
      directionalLight.position.x = window.scrollY * 0.05;
      directionalLight.position.y = window.scrollY * 0.05;

      moon.rotation.y += 0.0002;

      camera.updateProjectionMatrix();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    // ----- RESIZE -----
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [startAnimation]);

  useEffect(() => {
    if (!canvasRef_3.current) return;
    if (!startAnimation) return;

    const canvas = canvasRef_3.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    effectRef.current = new Effect(ctx, canvas.width, canvas.height);

    function animate() {
      effectRef.current.ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(animate);
      effectRef.current.render();
    }

    animate();

    // ----- TRIGGER FADE IN OF THE BUTTONS -----
    timeoutRef.current = setTimeout(() => {
      buttonRef.current!.style.opacity = "1";
    }, 2000);

    // ----- RESIZE -----
    const handleResize = () => {
      cancelAnimationFrame(animationRef.current);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effectRef.current = new Effect(ctx, canvas.width, canvas.height);
      animate();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startAnimation]);

  if (!isPageLoaded) {
    return (
      <div className="loading_div">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <section className="section_3">
      <div ref={modalDivRef} className="fade_out_modal_div"></div>

      <NavBar startFadeIn={startFadeIn} />

      <canvas
        ref={canvasRef_2}
        className="canvas_2 absoluteFullScreen"
      ></canvas>
      <canvas
        ref={canvasRef_3}
        className="canvas_3 absoluteFullScreen"
      ></canvas>
      <Link to="/exposition">
        <button ref={buttonRef} className="start_tour_btn">
          Start Tour
        </button>
      </Link>

      <div className="intro_text_box">
        {/* <h1 className="text_mondatelier">Mondatelier</h1>
        <Clock /> */}
      </div>
      <div ref={footerRef} className="footer">
        &copy; Kursat Cakmak
      </div>
    </section>
  );
}
