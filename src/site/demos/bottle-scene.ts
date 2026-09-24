import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export interface BottleOptions {
  color: string;
  size: "500" | "750";
  cap: "classic" | "sport";
}

/**
 * Product configurator scene: a lathe-turned bottle with a swappable cap.
 * Renders only while visible; the caller pushes option changes through `update`.
 * Colour and height ease toward the new values instead of jumping.
 */
export function createBottleScene(host: HTMLElement, canvas: HTMLCanvasElement, initial: BottleOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 1.35, 7.4);
  camera.lookAt(0, 1.1, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xfff4e6, 2.2);
  key.position.set(-3, 5, 4);
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x6b6656, 0.8));

  const product = new THREE.Group();
  scene.add(product);

  // Body: one lathe profile with a soft base, straight wall and rounded shoulder
  const profile = [
    [0, 0], [0.5, 0], [0.58, 0.03], [0.62, 0.1], [0.625, 0.25], [0.625, 1.62],
    [0.6, 1.78], [0.52, 1.9], [0.45, 1.97], [0.43, 2.02],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: initial.color, metalness: 0.15, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.35,
  });
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), bodyMaterial);
  product.add(body);

  // A thin brushed-steel ring where body meets cap
  const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccc6, metalness: 1, roughness: 0.28 });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.06, 64), steel);
  band.position.y = 2.05;
  product.add(band);

  const capMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1d1e21, metalness: 0.1, roughness: 0.5, clearcoat: 0.3 });
  const classicCap = new THREE.Mesh(
    new THREE.LatheGeometry(
      [[0, 0], [0.45, 0], [0.46, 0.05], [0.46, 0.3], [0.43, 0.36], [0.3, 0.39], [0, 0.39]].map(([x, y]) => new THREE.Vector2(x, y)),
      64,
    ),
    capMaterial,
  );
  const sportCap = new THREE.Group();
  const sportBase = new THREE.Mesh(
    new THREE.LatheGeometry(
      [[0, 0], [0.45, 0], [0.46, 0.05], [0.46, 0.22], [0.36, 0.3], [0.16, 0.34], [0.14, 0.46], [0, 0.46]].map(([x, y]) => new THREE.Vector2(x, y)),
      64,
    ),
    capMaterial,
  );
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 16, 48, Math.PI), steel);
  loop.position.y = 0.26;
  loop.rotation.y = Math.PI / 2;
  sportCap.add(sportBase, loop);
  const capHolder = new THREE.Group();
  capHolder.position.y = 2.08;
  capHolder.add(classicCap, sportCap);
  product.add(capHolder);

  // Soft contact shadow: a radial gradient on a plane, no shadow maps needed
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const g = shadowCanvas.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(17,18,20,0.32)");
  grad.addColorStop(1, "rgba(17,18,20,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 1.3),
    new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  let target = { ...initial };
  const targetColor = new THREE.Color(initial.color);
  let heightScale = initial.size === "750" ? 1 : 0.86;
  let capBlend = initial.cap === "sport" ? 1 : 0;

  // Drag to turn; idle spin resumes a moment after release
  let angle = -0.5, velocity = 0, dragging = false, lastX = 0, idleAt = 0;
  const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    velocity = dx * 0.012;
    angle += velocity;
  };
  const up = () => { dragging = false; idleAt = performance.now() + 1600; };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  let visible = false, frame = 0, previous = performance.now(), stopped = false;
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    render();
  };
  function render() {
    renderer.render(scene, camera);
  }
  function tick(now: number) {
    frame = 0;
    if (stopped || !visible || document.hidden) return;
    const dt = Math.min(0.05, (now - previous) / 1000);
    previous = now;
    if (!dragging) {
      velocity *= 0.92;
      angle += velocity;
      if (now > idleAt) angle += dt * 0.35;
    }
    product.rotation.y = angle;
    bodyMaterial.color.lerp(targetColor, 1 - Math.pow(0.001, dt));
    const wantH = target.size === "750" ? 1 : 0.86;
    heightScale += (wantH - heightScale) * (1 - Math.pow(0.002, dt));
    body.scale.y = heightScale;
    band.position.y = 2.05 * heightScale;
    capHolder.position.y = 2.08 * heightScale;
    const wantCap = target.cap === "sport" ? 1 : 0;
    capBlend += (wantCap - capBlend) * (1 - Math.pow(0.001, dt));
    classicCap.scale.setScalar(Math.max(0.001, 1 - capBlend));
    sportCap.scale.setScalar(Math.max(0.001, capBlend));
    render();
    frame = requestAnimationFrame(tick);
  }
  const start = () => { if (!frame && visible && !stopped) { previous = performance.now(); frame = requestAnimationFrame(tick); } };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  });
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const onVisibility = () => { if (!document.hidden) start(); };
  document.addEventListener("visibilitychange", onVisibility);
  resize();

  return {
    update(next: BottleOptions) {
      target = { ...next };
      targetColor.set(next.color);
      start();
    },
    dispose() {
      stopped = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | undefined;
        if (m) m.dispose();
      });
      shadowTexture.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
