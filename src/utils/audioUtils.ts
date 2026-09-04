/**
 * Advanced Audio Utilities for LumiCal Atelier
 * Supports Web Audio API hardware speaker routing, volume amplification,
 * live VU meter, audio decoding, and speaker diagnostic testing.
 */

let sharedAudioContext: AudioContext | null = null;

/**
 * Initializes and unlocks the hardware AudioContext on user interaction
 */
export async function ensureAudioContext(): Promise<AudioContext> {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    try {
      await sharedAudioContext.resume();
    } catch (e) {
      console.warn('Could not resume AudioContext:', e);
    }
  }
  return sharedAudioContext;
}

export function getAudioContext(): AudioContext {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

/**
 * Formats seconds into mm:ss
 */
export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Plays a loud, clear, crystal-audible acoustic bell chime
 * Specifically designed to test device speakers and verify sound is working
 */
export async function playSpeakerTestSound(onEnded?: () => void): Promise<() => void> {
  try {
    const ctx = await ensureAudioContext();
    const now = ctx.currentTime;

    // Rich pentatonic chime sequence: C4, E4, G4, C5 with acoustic harmonic richness
    const chimeNotes = [
      { freq: 261.63, start: 0.0, dur: 1.2, gain: 0.5 }, // C4
      { freq: 329.63, start: 0.2, dur: 1.2, gain: 0.5 }, // E4
      { freq: 392.00, start: 0.4, dur: 1.5, gain: 0.6 }, // G4
      { freq: 523.25, start: 0.7, dur: 2.2, gain: 0.7 }, // C5
      { freq: 659.25, start: 1.0, dur: 2.5, gain: 0.6 }  // E5
    ];

    const masterGain = ctx.createGain();
    // Loud, clear volume to test speaker
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];

    chimeNotes.forEach(({ freq, start, dur, gain }) => {
      // Fundamental oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      oscGain.gain.setValueAtTime(0, now + start);
      oscGain.gain.linearRampToValueAtTime(gain, now + start + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now + start);
      osc.stop(now + start + dur);
      oscillators.push(osc);

      // Warm octave harmonic for presence on small mobile/laptop speakers
      const harmonicOsc = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      harmonicOsc.type = 'triangle';
      harmonicOsc.frequency.setValueAtTime(freq * 2, now + start);

      harmonicGain.gain.setValueAtTime(0, now + start);
      harmonicGain.gain.linearRampToValueAtTime(gain * 0.35, now + start + 0.03);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur * 0.8);

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(masterGain);

      harmonicOsc.start(now + start);
      harmonicOsc.stop(now + start + dur * 0.8);
      oscillators.push(harmonicOsc);
    });

    const totalDurationMs = 3500;
    const timer = setTimeout(() => {
      if (onEnded) onEnded();
    }, totalDurationMs);

    return () => {
      clearTimeout(timer);
      try {
        oscillators.forEach((o) => o.stop());
      } catch (e) {
        // already stopped
      }
    };
  } catch (e) {
    console.warn('playSpeakerTestSound failed:', e);
    if (onEnded) onEnded();
    return () => {};
  }
}

/**
 * Controller returned when playing audio directly through Web Audio API
 */
export interface AudioPlayerController {
  stop: () => void;
  setVolume: (multiplier: number) => void;
  getDuration: () => number;
}

/**
 * Plays an audio Blob through the hardware speakers using Web Audio API
 * Benefits:
 * 1. Bypasses iframe / HTML5 audio autoplay limitations
 * 2. Directly connects to AudioContext.destination
 * 3. Provides hardware GainNode boost (up to 200%) for soft microphone recordings
 * 4. Falls back to HTML5 Audio if decoding fails
 */
export async function playAudioBlobToSpeaker(
  blob: Blob,
  volume = 1.0,
  onProgress?: (currentTime: number, duration: number) => void,
  onEnded?: () => void
): Promise<AudioPlayerController> {
  const ctx = await ensureAudioContext();
  let isStopped = false;
  let animTimer: number | null = null;
  let sourceNode: AudioBufferSourceNode | null = null;
  let gainNode: GainNode | null = null;
  let fallbackAudio: HTMLAudioElement | null = null;
  let fallbackUrl: string | null = null;

  try {
    const arrayBuffer = await blob.arrayBuffer();
    // Decode audio data into PCM memory buffer
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    sourceNode = ctx.createBufferSource();
    sourceNode.buffer = audioBuffer;

    gainNode = ctx.createGain();
    // Allow volume boost (e.g. 1.0 - 2.0x)
    gainNode.gain.setValueAtTime(Math.max(0, volume), ctx.currentTime);

    sourceNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    const startTime = ctx.currentTime;

    // Track playback progress
    const checkProgress = () => {
      if (isStopped) return;
      const elapsed = ctx.currentTime - startTime;
      if (elapsed >= duration) {
        if (onProgress) onProgress(duration, duration);
        if (onEnded) onEnded();
        return;
      }
      if (onProgress) onProgress(elapsed, duration);
      animTimer = requestAnimationFrame(checkProgress);
    };

    sourceNode.onended = () => {
      if (!isStopped) {
        isStopped = true;
        if (animTimer) cancelAnimationFrame(animTimer);
        if (onProgress) onProgress(duration, duration);
        if (onEnded) onEnded();
      }
    };

    sourceNode.start(0);
    animTimer = requestAnimationFrame(checkProgress);

    return {
      stop: () => {
        isStopped = true;
        if (animTimer) cancelAnimationFrame(animTimer);
        try {
          if (sourceNode) sourceNode.stop();
        } catch (e) {}
      },
      setVolume: (v: number) => {
        if (gainNode && ctx) {
          gainNode.gain.setValueAtTime(Math.max(0, v), ctx.currentTime);
        }
      },
      getDuration: () => duration
    };
  } catch (decodeErr) {
    console.warn('Web Audio decodeAudioData fallback to HTML5 Audio:', decodeErr);

    // Fallback: HTML5 Audio element with direct speaker playback
    fallbackUrl = URL.createObjectURL(blob);
    fallbackAudio = new Audio(fallbackUrl);
    fallbackAudio.volume = Math.min(1.0, volume);

    fallbackAudio.ontimeupdate = () => {
      if (fallbackAudio && onProgress) {
        onProgress(fallbackAudio.currentTime, fallbackAudio.duration || 1);
      }
    };

    fallbackAudio.onended = () => {
      if (fallbackUrl) URL.revokeObjectURL(fallbackUrl);
      if (onEnded) onEnded();
    };

    try {
      await fallbackAudio.play();
    } catch (playErr) {
      console.error('HTML5 Audio play failed:', playErr);
      if (onEnded) onEnded();
    }

    return {
      stop: () => {
        if (fallbackAudio) {
          fallbackAudio.pause();
          fallbackAudio.currentTime = 0;
        }
        if (fallbackUrl) URL.revokeObjectURL(fallbackUrl);
      },
      setVolume: (v: number) => {
        if (fallbackAudio) {
          fallbackAudio.volume = Math.min(1.0, Math.max(0, v));
        }
      },
      getDuration: () => (fallbackAudio ? fallbackAudio.duration || 4 : 4)
    };
  }
}

/**
 * Generates an authentic mono WAV Audio Blob in memory
 * Perfect for fallback, demo recordings, and instant playback testing without network
 */
export function createSyntheticAudioBlob(durationSeconds = 4): Blob {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // 'RIFF' chunk
  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + numSamples * 2, true);
  // 'WAVE'
  view.setUint32(8, 0x57415645, false);
  // 'fmt ' subchunk
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // Linear quantization
  view.setUint16(22, 1, true); // 1 Channel (Mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  // 'data' subchunk
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, numSamples * 2, true);

  // Musical chord melody: Pentatonic warm greeting (C4, E4, G4, C5)
  const notes = [
    { freq: 261.63, start: 0.0, dur: 1.0 }, // C4
    { freq: 329.63, start: 0.6, dur: 1.0 }, // E4
    { freq: 392.00, start: 1.2, dur: 1.2 }, // G4
    { freq: 523.25, start: 2.0, dur: 1.9 }  // C5
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let wave = 0;

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.dur) {
        const noteT = t - note.start;
        // Natural bell/chime envelope
        const env = Math.min(1, noteT * 25) * Math.exp(-noteT * 1.5);
        // Fundamental tone + gentle warm harmonics
        const val =
          0.7 * Math.sin(2 * Math.PI * note.freq * noteT) +
          0.4 * Math.sin(2 * Math.PI * note.freq * 2 * noteT) +
          0.15 * Math.sin(2 * Math.PI * note.freq * 3 * noteT);
        wave += val * env;
      }
    }

    const sample = Math.max(-1, Math.min(1, wave * 0.85));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(44 + i * 2, intSample, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Plays a spatial chime sound directly through speakers
 */
export function playSpatialChimeSound(onEnded?: () => void): () => void {
  let stopped = false;
  let stopFn: (() => void) | null = null;

  playSpeakerTestSound(() => {
    if (!stopped && onEnded) onEnded();
  }).then((fn) => {
    if (stopped) {
      fn();
    } else {
      stopFn = fn;
    }
  });

  return () => {
    stopped = true;
    if (stopFn) stopFn();
  };
}
