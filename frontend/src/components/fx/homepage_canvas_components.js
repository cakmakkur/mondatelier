import * as THREE from "three";

// MOON
const moonGeometry = new THREE.SphereGeometry(10, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load("/moon_texture.jpg"),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(12, 0, 0);

// ANCHOR
const anchorGeometry = new THREE.SphereGeometry(0.05, 24, 24);
const anchorMmaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const anchor = new THREE.Mesh(anchorGeometry, anchorMmaterial);
anchor.position.set(0, 0, 0);

export { moon, anchor };
