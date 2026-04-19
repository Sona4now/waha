/**
 * Procedural chime / bell tones using the Web Audio API.
 * No audio files needed — we synthesize bells on the fly.
 * Called from the SessionPlayer at phase boundaries.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  // Browsers suspend the context until a user gesture; try to resume.
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/**
 * Play a gentle sine-wave bell.
 * @param freq base frequency (e.g. 523.25 for C5)
 * @param volume 0..1 master gain
 * @param duration seconds — decay tail
 */
export function playChime(freq = 523.25, volume = 0.5, duration = 1.6) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  // Fundamental + a quiet octave partial to warm the tone.
  const partials = [
    { f: freq, gain: 1 },
    { f: freq * 2, gain: 0.25 },
    { f: freq * 3.01, gain: 0.08 }, // slight detune for realism
  ];

  const master = ac.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(volume, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.001, now + duration);
  master.connect(ac.destination);

  partials.forEach((p) => {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = p.f;
    g.gain.value = p.gain;
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + duration);
  });
}

/** Session start — high open bell. */
export function playStartChime(volume = 0.5) {
  playChime(659.25, volume, 2.0); // E5
  setTimeout(() => playChime(880.0, volume * 0.7, 2.4), 220); // A5 harmony
}

/** Session end — softer descending bell. */
export function playEndChime(volume = 0.5) {
  playChime(523.25, volume, 2.4); // C5
  setTimeout(() => playChime(392.0, volume * 0.7, 3.0), 260); // G4
}

/** Subtle tick between breath phases. */
export function playPhaseTick(volume = 0.25) {
  playChime(783.99, volume, 0.4); // G5 short
}
