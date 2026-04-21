/**
 * Procedural ambient soundscapes — 100% browser-generated, zero files.
 *
 * For each environment (sea/desert/mountain/oasis) we synthesize a unique
 * layered soundscape using the Web Audio API:
 *   · Filtered noise (pink / white) → base texture
 *   · LFOs (low-freq oscillators) → slow modulation (wave cycles, wind gusts)
 *   · Optional sine drones → harmonic warmth
 *
 * All layers route through a single master gain so volume/ducking control is
 * centralized. Everything lives in memory — no CDN, no storage, no tracking.
 *
 * Usage:
 *   const ambient = startAmbient("sea", 0.6);     // 60% volume
 *   ambient.setVolume(0.3);                        // duck while VO speaks
 *   ambient.setVolume(0.6);                        // restore
 *   ambient.stop();                                // full teardown
 */

import type { EnvId } from "./environments";

export interface AmbientController {
  setVolume: (v: number) => void;
  stop: () => void;
}

// ─── Audio context singleton ──────────────────────────────────
let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/**
 * Fills an AudioBuffer with a short slice of pink noise.
 * Pink noise (1/f) feels more "natural" than white noise — closer to wind,
 * surf, and breath. We reuse one 2-second buffer as a loop source.
 */
function makePinkNoiseBuffer(ac: AudioContext, seconds = 2): AudioBuffer {
  const buf = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buf.getChannelData(0);
  // Paul Kellet's economy pink-noise filter
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buf;
}

function makeLoopingNoise(
  ac: AudioContext,
  seconds = 2,
): AudioBufferSourceNode {
  const source = ac.createBufferSource();
  source.buffer = makePinkNoiseBuffer(ac, seconds);
  source.loop = true;
  return source;
}

/* ═════════════════════════════════════════════════════════════
   SEA — Red Sea waves: pink noise + slow bandpass sweep + LFO
   ═════════════════════════════════════════════════════════════ */
function startSeaAmbient(
  ac: AudioContext,
  master: GainNode,
): () => void {
  // Base "surf" — bandpassed pink noise
  const noise = makeLoopingNoise(ac, 4);
  const bandpass = ac.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 400;
  bandpass.Q.value = 0.6;
  const surfGain = ac.createGain();
  surfGain.gain.value = 1.4;

  // LFO: modulates the bandpass frequency slowly → wave-like rising/falling
  const lfo = ac.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08; // ≈ 8s cycle — a slow "wave"
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 200; // ±200Hz sweep around 400Hz
  lfo.connect(lfoGain).connect(bandpass.frequency);

  // Amplitude LFO on the surf itself — waves coming and receding
  const ampLfo = ac.createOscillator();
  ampLfo.type = "sine";
  ampLfo.frequency.value = 0.11; // slightly different phase → organic feel
  const ampLfoGain = ac.createGain();
  ampLfoGain.gain.value = 0.5;
  ampLfo.connect(ampLfoGain).connect(surfGain.gain);

  noise.connect(bandpass).connect(surfGain).connect(master);

  noise.start();
  lfo.start();
  ampLfo.start();

  return () => {
    try {
      noise.stop();
      lfo.stop();
      ampLfo.stop();
    } catch {
      /* already stopped */
    }
  };
}

/* ═════════════════════════════════════════════════════════════
   DESERT — Siwa wind: high-passed pink noise + deep drone
   ═════════════════════════════════════════════════════════════ */
function startDesertAmbient(
  ac: AudioContext,
  master: GainNode,
): () => void {
  // Wind — pink noise highpassed
  const noise = makeLoopingNoise(ac, 6);
  const highpass = ac.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 600;
  highpass.Q.value = 0.7;
  const windGain = ac.createGain();
  windGain.gain.value = 0.6;

  // Wind gusts — slow amplitude LFO
  const gustLfo = ac.createOscillator();
  gustLfo.type = "sine";
  gustLfo.frequency.value = 0.05; // 20s gust cycle
  const gustAmt = ac.createGain();
  gustAmt.gain.value = 0.4;
  gustLfo.connect(gustAmt).connect(windGain.gain);

  // Deep drone — sense of vastness
  const drone = ac.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 55; // low A
  const droneGain = ac.createGain();
  droneGain.gain.value = 0.12;

  noise.connect(highpass).connect(windGain).connect(master);
  drone.connect(droneGain).connect(master);

  noise.start();
  gustLfo.start();
  drone.start();

  return () => {
    try {
      noise.stop();
      gustLfo.stop();
      drone.stop();
    } catch {
      /* already stopped */
    }
  };
}

/* ═════════════════════════════════════════════════════════════
   MOUNTAIN — Sinai dawn: airy noise + soft high drone
   ═════════════════════════════════════════════════════════════ */
function startMountainAmbient(
  ac: AudioContext,
  master: GainNode,
): () => void {
  const noise = makeLoopingNoise(ac, 4);
  const bandpass = ac.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 1200;
  bandpass.Q.value = 1;
  const airGain = ac.createGain();
  airGain.gain.value = 0.35;

  // Soft high drone — evokes clear air
  const drone = ac.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 220; // A3 warm
  const droneGain = ac.createGain();
  droneGain.gain.value = 0.08;

  // Second drone — fifth harmony
  const drone2 = ac.createOscillator();
  drone2.type = "sine";
  drone2.frequency.value = 330;
  const drone2Gain = ac.createGain();
  drone2Gain.gain.value = 0.05;

  noise.connect(bandpass).connect(airGain).connect(master);
  drone.connect(droneGain).connect(master);
  drone2.connect(drone2Gain).connect(master);

  noise.start();
  drone.start();
  drone2.start();

  return () => {
    try {
      noise.stop();
      drone.stop();
      drone2.stop();
    } catch {
      /* already stopped */
    }
  };
}

/* ═════════════════════════════════════════════════════════════
   OASIS — Fayoum stream: trickle noise + gentle harmonic drone
   ═════════════════════════════════════════════════════════════ */
function startOasisAmbient(
  ac: AudioContext,
  master: GainNode,
): () => void {
  // Stream trickle — higher-freq bandpass with bubble-like amplitude flicker
  const noise = makeLoopingNoise(ac, 3);
  const bandpass = ac.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2000;
  bandpass.Q.value = 2;
  const streamGain = ac.createGain();
  streamGain.gain.value = 0.35;

  // Fast tremolo for "trickling" feel
  const tremolo = ac.createOscillator();
  tremolo.type = "sine";
  tremolo.frequency.value = 3.5;
  const tremGain = ac.createGain();
  tremGain.gain.value = 0.25;
  tremolo.connect(tremGain).connect(streamGain.gain);

  // Warm low drone
  const drone = ac.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 110; // A2
  const droneGain = ac.createGain();
  droneGain.gain.value = 0.12;

  noise.connect(bandpass).connect(streamGain).connect(master);
  drone.connect(droneGain).connect(master);

  noise.start();
  tremolo.start();
  drone.start();

  return () => {
    try {
      noise.stop();
      tremolo.stop();
      drone.stop();
    } catch {
      /* already stopped */
    }
  };
}

/* ═════════════════════════════════════════════════════════════
   Entry point
   ═════════════════════════════════════════════════════════════ */
export function startAmbient(
  env: EnvId,
  initialVolume: number = 0.5,
): AmbientController | null {
  const ac = getCtx();
  if (!ac) return null;

  const master = ac.createGain();
  master.gain.value = Math.max(0, Math.min(1, initialVolume));
  master.connect(ac.destination);

  let teardown: () => void;
  switch (env) {
    case "sea":
      teardown = startSeaAmbient(ac, master);
      break;
    case "desert":
      teardown = startDesertAmbient(ac, master);
      break;
    case "mountain":
      teardown = startMountainAmbient(ac, master);
      break;
    case "oasis":
      teardown = startOasisAmbient(ac, master);
      break;
    default:
      teardown = () => {};
  }

  let stopped = false;
  return {
    setVolume(v: number) {
      if (stopped) return;
      const clamped = Math.max(0, Math.min(1, v));
      // Smooth ramp to avoid clicks when ducking
      const now = ac.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(clamped, now + 0.25);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      // Fade out over 400ms to avoid a click
      const now = ac.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(0, now + 0.4);
      setTimeout(() => {
        try {
          teardown();
          master.disconnect();
        } catch {
          /* ignore */
        }
      }, 450);
    },
  };
}
