<template>
  <div class="inset-0 mx-auto aspect-[1/1] w-full">
    <canvas ref="globeCanvasRef"
      class="canvas size-full opacity-0 transition-opacity duration-1000 ease-in-out [contain:layout_paint_size]"></canvas>
  </div>
</template>

<script lang="ts" setup>
import createGlobe, { type COBEOptions } from "cobe";
import { useSpring } from "vue-use-spring";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

type GlobeProps = {
  config?: Partial<COBEOptions>;
  mass?: number;
  tension?: number;
  friction?: number;
  precision?: number;
};

const DEFAULT_CONFIG: COBEOptions = {
  width: 200,
  height: 200,
  onRender: () => {},
  devicePixelRatio: 1,
  phi: 0,
  theta: 0.3,
  dark: 1.5,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

const markerAnimationStates = DEFAULT_CONFIG.markers.map(() => ({
  phase: Math.random() * Math.PI * 2,
  speed: Math.random() * 0.02 + 0.02,
}));

const props = withDefaults(defineProps<GlobeProps>(), {
  mass: 1,
  tension: 280,
  friction: 100,
  precision: 0.001,
});

const globeCanvasRef = ref<HTMLCanvasElement>();
const phi = ref(0);
const width = ref(0);
const height = ref(0);

let globe: ReturnType<typeof createGlobe> | null = null;

const spring = useSpring(
  {
    r: 0,
  },
  {
    mass: props.mass,
    tension: props.tension,
    friction: props.friction,
    precision: props.precision,
  },
);

const config = computed(() => {
  return {
    ...DEFAULT_CONFIG,
    ...props.config,
  };
});

function onRender(state: Record<string, unknown>) {
  phi.value += 0.005;
  state.phi = phi.value + spring.r;
  state.width = width.value * config.value.devicePixelRatio;
  state.height = height.value * config.value.devicePixelRatio;

  state.markers = config.value.markers.map((marker, index) => {
    const anim = markerAnimationStates[index]!;
    anim.phase += anim.speed;
    const fade = (Math.sin(anim.phase) + 1) / 2;
    return {
      ...marker,
      size: marker.size * (0.5 + fade * 0.5),
    };
  });
}

function onResize() {
  if (globeCanvasRef.value) {
    width.value = globeCanvasRef.value.offsetWidth;
    height.value = globeCanvasRef.value.offsetHeight;
  }
}

function createGlobeOnMounted() {
  globe = createGlobe(globeCanvasRef.value!, {
    ...config.value,
    width: width.value * config.value.devicePixelRatio,
    height: height.value * config.value.devicePixelRatio,
    onRender,
  });
}

onMounted(() => {
  window.addEventListener("resize", onResize);
  onResize();
  createGlobeOnMounted();

  setTimeout(() => (globeCanvasRef.value!.style.opacity = "1"));
});

onBeforeUnmount(() => {
  globe?.destroy();
  window.removeEventListener("resize", onResize);
});
</script>