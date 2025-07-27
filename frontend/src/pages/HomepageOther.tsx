import { useEffect, useRef, useState } from "react";
// @ts-expect-error importing THREE.js assets
import * as THREE from "three";
// @ts-expect-error importing THREE.js assets
// prettier-ignore
import {moon,anchor} from "../components/fx/homepage_canvas_components.js";
import { useModalContext } from "../context/ModalContext.js";
import Signup from "../components/auth/Signup.js";

export default function HomepageOther() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [startApproachMoon, setStartApproachMoon] = useState(false);
  const approachMoonRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const stars = useRef<THREE.Mesh[]>([]);
  // const phaseOffsets = useRef<number[]>([]);

  const { setComponentState } = useModalContext();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPageLoaded) return;
    setStartAnimation(true);
  }, [isPageLoaded]);

  useEffect(() => {
    approachMoonRef.current = startApproachMoon;
  }, [startApproachMoon]);

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

      // phaseOffsets.current.push(Math.random() * Math.PI * 2);
      // stars.current.push(star);
      star.position.set(x, y, z);
      anchor.add(star);
    };

    const xRange = [-100, 100];
    const yRange = [-40, 40];
    const zRange = [-110, 110];
    Array(600)
      .fill(null)
      .forEach(() => addStars(xRange, yRange, zRange));

    // const clock = new THREE.Clock();
    function animate() {
      // const elapsedTime = clock.getElapsedTime();

      // stars.current.forEach((star, i) => {
      //   const scale =
      //     0.5 + Math.abs(Math.sin(elapsedTime + phaseOffsets.current[i]));
      //   star.scale.set(scale, scale, scale);
      // });

      anchor.rotation.y += 0.0001;
      directionalLight.position.x = window.scrollY * 0.05;
      directionalLight.position.y = window.scrollY * 0.05;
      moon.rotation.y += 0.0002;

      // camera second position:
      camera.position.set(17, 5, 6);

      camera.updateProjectionMatrix();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      // zoom into moon animation
      // if (approachMoonRef.current) {
      //   const target = new THREE.Vector3(
      //     moon.position.x + 5,
      //     moon.position.y + 5,
      //     moon.position.z + 6
      //   );
      //   camera.position.lerp(target, 0.02);
      //   // camera.lookAt(moon.position);
      // }
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
        <button
          onClick={() => setComponentState(Signup)}
          className="homepage_create_account"
        >
          Create an account
        </button>
        <button
          style={{ background: "none", border: "none" }}
          onClick={() => setStartApproachMoon(true)}
        >
          A
        </button>
      </div>

      <div className="footer">&copy; Kursat Cakmak</div>
    </section>
  );
}
