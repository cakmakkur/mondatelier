import { useEffect, useRef, useState } from "react";
// @ts-expect-error importing THREE.js assets
import * as THREE from "three";
// @ts-expect-error importing THREE.js assets
import { moon } from "../components/fx/homepage_canvas_components.js";
import { useModalContext } from "../context/ModalContext.js";
import Signup from "../components/auth/Signup.js";
import { useAuthContext } from "../auth/AuthContext.js";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { auth } = useAuthContext();

  const { setComponentState } = useModalContext();

  useEffect(() => {
    setIsPageLoaded(true);
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
    camera.position.set(17, 5, 6);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    scene.add(moon);

    function animate() {
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
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <section className="homepage_container">
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
        {auth ? (
          <Link to="/explore" className="homepage_create_account">
            Explore artwors
          </Link>
        ) : (
          <button
            onClick={() => setComponentState(Signup)}
            className="homepage_create_account"
          >
            Create an account
          </button>
        )}
      </div>
    </section>
  );
}
