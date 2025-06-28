import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// @ts-expect-error importing THREE.js assets
import * as THREE from "three";
// @ts-expect-error importing THREE.js assets
import { moon, anchor } from "../assets/homepage_canvas_components.js";
import NavBar from "../components/Navbar.js";

export default function Homepage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<THREE.Mesh[]>([]);
  const phaseOffsets = useRef<number[]>([]);

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
    if (!isPageLoaded) return;
    setStartAnimation(true);
  }, [isPageLoaded]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current!,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("black");
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

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 30);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    scene.add(moon);
    scene.add(anchor);

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

    const clock = new THREE.Clock();
    function animate() {
      const elapsedTime = clock.getElapsedTime();

      stars.current.forEach((star, i) => {
        const scale =
          0.5 + Math.abs(Math.sin(elapsedTime + phaseOffsets.current[i]));
        star.scale.set(scale, scale, scale);
      });

      anchor.rotation.y += 0.0001;
      directionalLight.position.x = window.scrollY * 0.05;
      directionalLight.position.y = window.scrollY * 0.05;
      moon.rotation.y += 0.0002;

      camera.updateProjectionMatrix();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

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

  if (!isPageLoaded) {
    return (
      <div className="loading_div">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <section className="homepage_container">
      <NavBar />
      <canvas
        ref={canvasRef}
        className="homepage__canvas absoluteFullScreen"
      ></canvas>
      <div className="homepage__greeting">
        <h1>Share Your Passion</h1>
        <p>
          Whether you're here to showcase your work, find a new home for it or
          simply be inspired by others — you're in the right place.{" "}
        </p>
        <Link to="/exposition">
          <button className="start_tour_btn">Create an account</button>
        </Link>
      </div>

      <div className="footer">&copy; Kursat Cakmak</div>
    </section>
  );
}
