import { useEffect, useRef, useState } from "react";
import type { Artwork } from "../../../dto/Artwork";
import useAxiosPrivate from "../../../auth/useAxiosPrivate";
import { useProfileContext } from "../../../context/ProfileContext";

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ARTWORK_PATH = import.meta.env.VITE_ARTWORK_PATH;

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
  const [trackUrl, setTrackUrl] = useState<string | null>(null);
  const [tnUrl, setTnUrl] = useState<string | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { profile } = useProfileContext();

  const handleLikeClick = async () => {
    try {
      const response = await axiosPrivate.post(
        `${BASE_URL}/${ARTWORK_PATH}/like/${data.id}`
      );
      if (response.status === 200) {
        console.log("liked");
        return response.data;
      } else {
        // handle error
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  // pick thumbnail and audio once when data changes
  useEffect(() => {
    if (!data?.medias?.length) {
      setTnUrl("/headphones.svg");
      setTrackUrl(null);
      return;
    }

    let foundTn: string | null = null;
    let foundAudio: string | null = null;

    for (const m of data.medias) {
      if (m.isThumbnail && !foundTn) {
        foundTn = UPLOADS_URL + m.path;
      } else if (!m.isThumbnail && !foundAudio) {
        foundAudio = UPLOADS_URL + m.path;
      }
    }

    if (!foundAudio && data.medias[0]) {
      foundAudio = UPLOADS_URL + data.medias[0].path;
    }

    setTnUrl(foundTn || "/headphones.svg");
    setTrackUrl(foundAudio || null);
  }, [data]);

  // helper to compute waveform peaks client-side (RMS or max per block)
  const computePeaksFromArrayBuffer = async (
    arrayBuffer: ArrayBuffer,
    numPeaks = 256
  ) => {
    const tempCtx = new (window.OfflineAudioContext ||
      (window as any).AudioContext)(1, 1, 44100);
    const decoded = await tempCtx.decodeAudioData(arrayBuffer.slice(0));
    const channelData = decoded.getChannelData(0);
    const blockSize = Math.floor(channelData.length / numPeaks);
    const newPeaks: number[] = new Array(numPeaks).fill(0);

    for (let p = 0; p < numPeaks; p++) {
      const start = p * blockSize;
      const end = Math.min(start + blockSize, channelData.length);
      let sum = 0;
      let max = 0;
      for (let i = start; i < end; i++) {
        const val = Math.abs(channelData[i]);
        sum += val * val;
        if (val > max) max = val;
      }
      const rms = Math.sqrt(sum / Math.max(1, end - start));
      newPeaks[p] = rms;
    }

    const maxPeak = Math.max(...newPeaks, 1e-6);
    for (let i = 0; i < newPeaks.length; i++)
      newPeaks[i] = newPeaks[i] / maxPeak;
    return newPeaks;
  };

  // draw static waveform once (peaks present) - uses CSS pixels (clientWidth/clientHeight)
  const drawStaticWaveform = (
    ctx: CanvasRenderingContext2D,
    peaksArr: number[],
    progress = 0 // 0..1
  ) => {
    const canvas = ctx.canvas as HTMLCanvasElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // clear using CSS pixels
    ctx.clearRect(0, 0, width, height);

    // background
    ctx.fillStyle = "rgba(248,250,255,1)";
    ctx.fillRect(0, 0, width, height);

    const num = peaksArr.length;
    const barWidth = width / num;

    for (let i = 0; i < num; i++) {
      const v = peaksArr[i];
      const barH = Math.max(1, v * height * 0.9);
      const x = i * barWidth;
      const y = (height - barH) / 2;

      // make bars darker when they're in the played region
      const barCenterRatio = (i + 0.5) / num; // center of the bar
      if (barCenterRatio <= progress) {
        ctx.fillStyle = "rgba(110,61,2,0.9)"; // darker for played
      } else {
        ctx.fillStyle = "rgba(110,61,2,0.45)"; // lighter for unplayed
      }

      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barH);
    }
  };

  // canvas DPI + resize
  const resizeCanvasForDPR = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 300;
    const cssHeight = canvas.clientHeight || 40;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // drawing in CSS pixels
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    resizeCanvasForDPR(canvas);

    const onResize = () => resizeCanvasForDPR(canvasRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // compute peaks when trackUrl becomes available
  useEffect(() => {
    let didCancel = false;
    const loadAndCompute = async () => {
      if (!trackUrl) return;
      try {
        const res = await fetch(trackUrl, { mode: "cors" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const buffer = await res.arrayBuffer();
        const newPeaks = await computePeaksFromArrayBuffer(buffer, 256);
        if (!didCancel) {
          setPeaks(newPeaks);
          const canvas = canvasRef.current;
          if (canvas && newPeaks) {
            const ctx = canvas.getContext("2d");
            if (ctx) drawStaticWaveform(ctx, newPeaks, 0);
          }
        }
      } catch (err) {
        console.warn("Could not compute peaks client-side:", err);
      }
    };
    loadAndCompute();
    return () => {
      didCancel = true;
    };
  }, [trackUrl]);

  // audio element: set src and ensure metadata loads when trackUrl changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (trackUrl) {
      if (audio.src !== trackUrl) {
        audio.src = trackUrl;
      }
      try {
        audio.load();
      } catch (e) {
        console.error(e);
      }
    } else {
      audio.removeAttribute("src");
      try {
        audio.load();
      } catch (e) {
        console.error(e);
      }
      setDuration(0);
      setCurrentTime(0);
    }
  }, [trackUrl]);

  // attach audio event listeners (re-run when trackUrl changes)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnd = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    if (audio.readyState >= 1) {
      setDuration(audio.duration || 0);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [trackUrl]);

  // redraw static waveform when peaks / currentTime / duration change
  useEffect(() => {
    if (!peaks) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const prog =
      duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    drawStaticWaveform(ctx, peaks, prog);
  }, [peaks, currentTime, duration]);

  // start analyser + realtime draw (draw static waveform first if available)
  const startVisualizer = async () => {
    if (!audioRef.current || !canvasRef.current) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch (err) {
        console.error(err);
      }
    }

    if (!analyserRef.current) {
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );
    }

    if (!sourceRef.current && audioRef.current) {
      try {
        sourceRef.current = audioCtxRef.current.createMediaElementSource(
          audioRef.current
        );
        sourceRef.current.connect(analyserRef.current!);
        analyserRef.current!.connect(audioCtxRef.current.destination);
      } catch (e) {
        console.warn("Could not create media element source:", e);
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (peaks) {
      drawStaticWaveform(
        ctx,
        peaks,
        duration > 0 ? Math.min(1, currentTime / duration) : 0
      );
    } else {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
        return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const prog =
        audioRef.current && duration > 0
          ? Math.min(1, Math.max(0, audioRef.current.currentTime / duration))
          : 0;

      if (peaks) drawStaticWaveform(ctx, peaks, prog);
      else {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const bars = 48;
      const step = Math.max(
        1,
        Math.floor(dataArrayRef.current.length / bars / 6)
      );
      const barWidth = canvas.clientWidth / bars;
      const height = canvas.clientHeight;

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

    if (rafRef.current == null) draw();
  };

  // respond to play state changes
  useEffect(() => {
    if (isPlaying) {
      (async () => {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }
        try {
          if (audioCtxRef.current.state === "suspended")
            await audioCtxRef.current.resume();
        } catch (err) {
          console.error(err);
        }
        await startVisualizer();
        try {
          await audioRef.current?.play();
        } catch (e) {
          console.error(e);
        }
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
      try {
        audioCtxRef.current?.close();
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || !canvasRef.current) return;
    if (duration <= 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(1, Math.max(0, x / rect.width));
    audioRef.current.currentTime = progress * duration;
    // update UI immediately (timeupdate may come a bit later)
    setCurrentTime(progress * duration);
    // immediate redraw of static waveform with the new progress
    if (peaks) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) drawStaticWaveform(ctx, peaks, progress);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="track_main_div">
      <div className="track_thumbnail">
        <img src={tnUrl || "/headphones.svg"} alt="" />
      </div>
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

          <div className="track_canvasBox" style={{ width: 300, height: 40 }}>
            <canvas
              onClick={onCanvasClick}
              ref={canvasRef}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className="right">
            <div className="time">
              {`${formatTime(currentTime)} / ${formatTime(duration)}`}
            </div>
          </div>
        </div>

        <div className="track_meta">
          <div>
            <span className="track_meta_title">{data.title}</span>
            <span className="track_meta__separator">&#183;</span>
            <span className="track_meta_ry">{data.releaseYear}</span>
          </div>
          <div>
            {data.profileId === profile?.id ? (
              <button className="track_meta_delete">
                <img src="/delete.svg" alt="" /> Delete track
              </button>
            ) : (
              <img
                onClick={handleLikeClick}
                className="art_meta_like"
                src="/thumb_up.svg"
                alt=""
              />
            )}
          </div>
        </div>

        {trackUrl ? (
          <audio
            ref={audioRef}
            crossOrigin="anonymous"
            src={trackUrl}
            preload="metadata"
            style={{ display: "none" }}
          />
        ) : (
          ""
        )}
      </li>
    </div>
  );
}
