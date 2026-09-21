import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const LENGTH = 88;
const SIDES = 12;

// A broad, elliptical section gives each strand a polished face and a soft edge.
function makeRibbon() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      new Float32Array((LENGTH + 1) * (SIDES + 1) * 3),
      3,
    ).setUsage(THREE.DynamicDrawUsage),
  );
  const indices: number[] = [];
  for (let i = 0; i < LENGTH; i++)
    for (let j = 0; j < SIDES; j++) {
      const a = i * (SIDES + 1) + j;
      const b = a + SIDES + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  // Close both ends without extra draw calls.
  for (let j = 1; j < SIDES - 1; j++) {
    indices.push(0, j + 1, j);
    const end = LENGTH * (SIDES + 1);
    indices.push(end, end + j, end + j + 1);
  }
  geometry.setIndex(indices);
  return geometry;
}

export function createVCScene(host: HTMLElement, canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 4000);
  camera.position.z = 1600;
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.045);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const light = new THREE.DirectionalLight(0xfff5e5, 3);
  light.position.set(-300, 400, 500);
  scene.add(light, new THREE.HemisphereLight(0xffffff, 0x62604c, 1.4));

  const v = new THREE.CurvePath<THREE.Vector3>();
  v.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-220, 135, 0),
      new THREE.Vector3(-139, -69, 0),
    ),
  );
  v.add(
    new THREE.CubicBezierCurve3(
      new THREE.Vector3(-139, -69, 0),
      new THREE.Vector3(-128, -114, 4),
      new THREE.Vector3(-94, -114, 4),
      new THREE.Vector3(-82, -69, 0),
    ),
  );
  v.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-82, -69, 0),
      new THREE.Vector3(0, 135, 0),
    ),
  );
  const letters = [
    v.getSpacedPoints(LENGTH),
    Array.from({ length: LENGTH + 1 }, (_, i) => {
      const a = ((48 + (i / LENGTH) * 264) * Math.PI) / 180;
      return new THREE.Vector3(
        126 + 99 * Math.cos(a),
        8 + 119 * Math.sin(a),
        Math.sin(a) * 13,
      );
    }),
  ];
  const ribbons = Array.from({ length: 6 }, (_, index) => {
    const copper = index % 3 === 2;
    const material = new THREE.MeshStandardMaterial({
      color: copper ? 0xbd542e : 0xa6b0a7,
      metalness: copper ? 0.8 : 1,
      roughness: copper ? 0.24 : 0.2,
      envMapIntensity: 1.4,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const geometry = makeRibbon();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return {
      mesh,
      geometry,
      material,
      points: Array.from({ length: LENGTH + 1 }, () => new THREE.Vector3()),
    };
  });
  const rotation = new THREE.Matrix4();
  const euler = new THREE.Euler();
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const zAxis = new THREE.Vector3(0, 0, 1);
  let width = 1,
    height = 1,
    top = 0,
    left = 0,
    boxWidth = 1,
    boxHeight = 1;
  let frame = 0,
    previous = 0,
    stopped = false,
    phase = 0;

  const measure = () => {
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    const rect = host.getBoundingClientRect();
    top = rect.top + window.scrollY;
    left = rect.left;
    boxWidth = rect.width;
    boxHeight = rect.height;
    renderer.setSize(width, height, false);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    schedule();
  };

  function draw(now: number) {
    frame = 0;
    if (stopped || document.hidden) return;
    const elapsed = Math.min(0.05, (now - previous) / 1000 || 0);
    previous = now;
    phase += elapsed;
    const scroll = window.scrollY;
    const start = Math.max(50, top + boxHeight * 0.5 - height * 0.62);
    const progress = ease(
      clamp((scroll - start) / Math.max(500, height * 0.8)),
    );
    const scale = Math.min(boxWidth / 540, boxHeight / 500);
    const originX = left + boxWidth / 2 - width / 2;
    const originY = height / 2 - (top - scroll + boxHeight / 2);
    const idle = 1 - progress;
    euler.set(
      0.12 + Math.sin(phase * 0.42) * 0.07,
      -0.3 + Math.sin(phase * 0.32) * 0.16,
      -0.055 + Math.sin(phase * 0.28) * 0.025,
    );
    rotation.makeRotationFromEuler(euler);
    scene.environmentRotation.y = Math.sin(phase * 0.18) * 0.16;

    ribbons.forEach(({ geometry, material, points }, index) => {
      const letter = Math.floor(index / 3);
      const layer = index % 3;
      const spread = (layer - 1) * 15;
      const morph = ease(clamp(progress * 1.14 - layer * 0.065));
      for (let i = 0; i <= LENGTH; i++) {
        const t = i / LENGTH;
        const base = letters[letter][i];
        tangent
          .subVectors(
            letters[letter][Math.min(LENGTH, i + 1)],
            letters[letter][Math.max(0, i - 1)],
          )
          .normalize();
        normal.set(-tangent.y, tangent.x, 0).normalize();
        point
          .copy(base)
          .addScaledVector(
            normal,
            spread *
              (letter === 0
                ? 1 - 0.4 * Math.exp(-(((t - 0.5) / 0.12) ** 2))
                : 1),
          )
          .applyMatrix4(rotation)
          .multiplyScalar(scale);
        point.x += originX;
        point.y += originY + Math.sin(phase * 0.65) * 5 * scale * idle;
        // Two large diagonal waves travel through the canvas instead of attaching to its edges.
        const travel = scroll * 0.00135 + letter * 2.1;
        const targetX =
          (t * 1.65 - 0.825) * width + Math.sin(travel * 0.7) * width * 0.18;
        const targetY =
          Math.sin(t * Math.PI * 1.65 + travel) * height * 0.38 +
          (letter ? -0.1 : 0.13) * height +
          spread * 1.8;
        const targetZ = Math.cos(t * Math.PI * 2 + travel) * 80;
        points[i].set(
          THREE.MathUtils.lerp(point.x, targetX, morph),
          THREE.MathUtils.lerp(point.y, targetY, morph),
          THREE.MathUtils.lerp(point.z, targetZ, morph),
        );
      }
      const positions = geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const wide =
        (layer === 2 ? 4.3 : 6.1) * scale * (1 - morph) +
        (width < 651 ? 2.8 : 5) * morph;
      const depth = 6 * scale * (1 - morph) + 3 * morph;
      for (let i = 0; i <= LENGTH; i++) {
        tangent
          .subVectors(
            points[Math.min(LENGTH, i + 1)],
            points[Math.max(0, i - 1)],
          )
          .normalize();
        normal.crossVectors(tangent, zAxis).normalize();
        binormal.crossVectors(tangent, normal).normalize();
        const twist =
          Math.sin((i / LENGTH) * Math.PI * 2 + phase * 0.3) *
          0.24 *
          (1 - morph);
        for (let j = 0; j <= SIDES; j++) {
          const a = (j / SIDES) * Math.PI * 2 + twist;
          const end = Math.min(1, Math.min(i, LENGTH - i) / 1.6);
          const taper =
            letter === 0
              ? 1 -
                0.4 *
                  Math.exp(-(((i / LENGTH - 0.5) / 0.12) ** 2)) *
                  (1 - morph)
              : 1;
          const cap = Math.sqrt(Math.max(0.001, 1 - (1 - end) ** 2)) * taper;
          point
            .copy(points[i])
            .addScaledVector(normal, Math.cos(a) * wide * cap)
            .addScaledVector(binormal, Math.sin(a) * depth * cap);
          positions.setXYZ(i * (SIDES + 1) + j, point.x, point.y, point.z);
        }
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      material.opacity = 1 - morph * (width < 651 ? 0.9 : 0.84);
    });
    renderer.render(scene, camera);
    host.dataset.motion = "active";
    canvas.style.opacity = "1";
    // Idle motion is limited to the visible hero; background waves render only on scroll.
    if (progress < 1) frame = requestAnimationFrame(draw);
  }
  function schedule() {
    if (!frame && !stopped && !document.hidden)
      frame = requestAnimationFrame(draw);
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      previous = performance.now();
      schedule();
    }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    stopped = true;
    cancelAnimationFrame(frame);
    delete host.dataset.motion;
    canvas.style.opacity = "0";
  }
  const observer = new ResizeObserver(measure);
  observer.observe(host);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", schedule, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  canvas.addEventListener("webglcontextlost", contextLost);
  measure();
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", measure);
    window.removeEventListener("scroll", schedule);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", contextLost);
    ribbons.forEach(({ geometry, material }) => {
      geometry.dispose();
      material.dispose();
    });
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    delete host.dataset.motion;
  };
}
