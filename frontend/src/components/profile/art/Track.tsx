import { useEffect, useRef, useState } from "react";
import type { Artwork } from "../../../dto/Artwork";

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

interface TrackProps {
  data: Artwork;
  onPlayExclusive: (id: string) => void;
  isPlaying: boolean;
}

export default function Track({
  data,
  onPlayExclusive,
  isPlaying,
}: TrackProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [peaks, setPeaks] = useState<number[] | null>(null); // precomputed peaks (0..1)

  // helper to compute waveform peaks client-side (RMS or max per block)
  const computePeaksFromArrayBuffer = async (
    arrayBuffer: ArrayBuffer,
    numPeaks = 256
  ) => {
    // Use a temporary offline AudioContext decode (safer than main audioCtx)
    const tempCtx = new (window.OfflineAudioContext ||
      (window as any).AudioContext)(1, 1, 44100);
    const decoded = await tempCtx.decodeAudioData(arrayBuffer.slice(0));
    const channelData = decoded.getChannelData(0); // take first channel
    const blockSize = Math.floor(channelData.length / numPeaks);
    const newPeaks: number[] = new Array(numPeaks).fill(0);

    for (let p = 0; p < numPeaks; p++) {
      const start = p * blockSize;
      const end = Math.min(start + blockSize, channelData.length);
      let sum = 0;
      let max = 0;
      for (let i = start; i < end; i++) {
        const val = Math.abs(channelData[i]);
        sum += val * val; // for RMS
        if (val > max) max = val;
      }
      // rms
      const rms = Math.sqrt(sum / Math.max(1, end - start));
      // choose either rms or max — rms is smoother
      newPeaks[p] = rms; // value in ~0..1
    }
    // normalize peaks to 0..1
    const maxPeak = Math.max(...newPeaks, 1e-6);
    for (let i = 0; i < newPeaks.length; i++)
      newPeaks[i] = newPeaks[i] / maxPeak;
    return newPeaks;
  };

  // draw static waveform once (peaks present)
  const drawStaticWaveform = (
    ctx: CanvasRenderingContext2D,
    peaksArr: number[]
  ) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);

    // background
    ctx.fillStyle = "rgba(256,256,256,1)";
    ctx.fillRect(0, 0, width, height);

    const num = peaksArr.length;
    const barWidth = width / num;
    ctx.fillStyle = "rgba(110, 61, 2,0.5"; // base waveform color

    for (let i = 0; i < num; i++) {
      const v = peaksArr[i];
      const barH = Math.max(1, v * height * 0.9);
      const x = i * barWidth;
      const y = (height - barH) / 2;
      // draw center-aligned bar (mirrored)
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barH);
    }
  };

  // start analyser + realtime draw (draw static waveform first if available)
  const startVisualizer = async () => {
    if (!audioRef.current || !canvasRef.current) return;

    // ensure AudioContext exists
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    // resume on user gesture
    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch (err) {
        // ignore
      }
    }

    // create source and analyser if not yet created
    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );

      // if source already created -> don't recreate (avoids InvalidStateError)
      if (!sourceRef.current) {
        // IMPORTANT: createMediaElementSource will be silent if crossOrigin is wrong.
        sourceRef.current = audioCtxRef.current.createMediaElementSource(
          audioRef.current
        );
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw static waveform if we computed peaks
    if (peaks) {
      drawStaticWaveform(ctx, peaks);
    } else {
      // small placeholder background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // overlay realtime bars using analyser
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
        return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // redraw static waveform each frame (or we could draw it once to an offscreen canvas and blit — optimization)
      if (peaks) drawStaticWaveform(ctx, peaks);
      else {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, width, height);
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const bars = 48;
      const step = Math.floor(dataArrayRef.current.length / bars / 6);
      const barWidth = width / bars;

      // draw overlay bars (semi-transparent)
      for (let i = 0; i < bars; i++) {
        const v = dataArrayRef.current[i * step] / 255;
        const barH = Math.max(2, v * height);
        const x = i * barWidth;
        const y = height - barH;
        ctx.fillStyle = `hsla(${180 + i * 2}, 80%, ${40 + v * 20}%, 0.9)`;
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), barH);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // start the loop
    if (rafRef.current == null) draw();
  };

  // compute peaks once when the component mounts (or data changes)
  useEffect(() => {
    let didCancel = false;
    const loadAndCompute = async () => {
      const audioUrl = UPLOADS_URL + data.medias[0].path;
      try {
        // fetch arrayBuffer (CORS required)
        const res = await fetch(audioUrl, { mode: "cors" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const buffer = await res.arrayBuffer();
        const newPeaks = await computePeaksFromArrayBuffer(buffer, 256);
        if (!didCancel) {
          setPeaks(newPeaks);
          // draw static waveform immediately if canvas exists
          const canvas = canvasRef.current;
          if (canvas && newPeaks) {
            const ctx = canvas.getContext("2d");
            if (ctx) drawStaticWaveform(ctx, newPeaks);
          }
        }
      } catch (err) {
        // if decoding fails (big files), consider server-side precompute
        console.warn("Could not compute peaks client-side:", err);
      }
    };
    loadAndCompute();
    return () => {
      didCancel = true;
    };
  }, [data.medias, UPLOADS_URL]);

  // set up audio listeners (metadata / timeupdate)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnd = () => {
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = null;
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  // respond to play state changes
  useEffect(() => {
    if (isPlaying) {
      // resume audio context on user action
      (async () => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }
        try {
          if (audioCtxRef.current.state === "suspended")
            await audioCtxRef.current.resume();
        } catch (err) {}
        await startVisualizer();
        audioRef.current?.play();
      })();
    } else {
      audioRef.current?.pause();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="track_main_div">
      <li className="track_main_li">
        <div className="track_main_li__upper">
          <button
            className="track_play_button"
            onClick={() => onPlayExclusive(data.id)}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="" />
            ) : (
              <img src="/play.svg" alt="" />
            )}
          </button>

          <div className="track_canvasBox">
            <canvas ref={canvasRef} width={300} height={40} />
          </div>

          <div className="right">
            <div className="time">
              {`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)
                .toString()
                .padStart(2, "0")} / ${Math.floor(duration / 60)}:${Math.floor(
                duration % 60
              )
                .toString()
                .padStart(2, "0")}`}
            </div>
          </div>
        </div>

        <div className="track_meta">
          <span className="title">{data.title}</span>
          <span className="track_meta__separator">&#183;</span>
          <span>
            <span>{data.releaseYear}</span>
          </span>
        </div>

        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          src={UPLOADS_URL + data.medias[0].path}
          preload="metadata"
        />
      </li>
    </div>
  );
}
