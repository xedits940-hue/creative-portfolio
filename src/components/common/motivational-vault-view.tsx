"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  RotateCcw,
  RotateCw,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Gauge,
  Film,
  Layers,
} from "lucide-react";
import { useSecretLanyard } from "@/providers/secret-lanyard-provider";
import ShuffleBurstCanvas from "./shuffle-burst-canvas";

interface VideoTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  durationFormatted: string;
  category: string;
  desc: string;
}

const VAULT_PLAYLIST: VideoTrack[] = [
  {
    id: "vault-reel",
    title: "VTECH Master Showreel & Archive",
    subtitle: "Cinematic Reel",
    src: "/vault-archive-wa.mp4",
    durationFormatted: "00:39",
    category: "VAULT ARCHIVE",
    desc: "Cinematic studio motion reel & archive footage by Vishal Sharma.",
  },
  {
    id: "vault-core",
    title: "VTECH Dynamic Fiery Core",
    subtitle: "Signature 4K Motion",
    src: "/logo-video.mp4",
    durationFormatted: "00:10",
    category: "SIGNATURE 4K",
    desc: "Obsidian V emblem ignited in crimson and violet plasma simulation.",
  },
  {
    id: "vault-silk",
    title: "Liquid Silk & Obsidian Motion",
    subtitle: "Ambient Engine",
    src: "/background-video.mp4",
    durationFormatted: "00:15",
    category: "AMBIENT ENGINE",
    desc: "Flowing organic silk particle simulation from the VTECH homepage.",
  },
  {
    id: "vault-orion",
    title: "Orion AI Autonomous Voice Agent",
    subtitle: "Voice Assistant",
    src: "/apps/orion.mp4",
    durationFormatted: "00:32",
    category: "VOICE AI",
    desc: "Biometric voice synthesis and sub-second speech streaming.",
  },
  {
    id: "vault-genesis-v3",
    title: "Genesis X V3 Apex Generative Studio",
    subtitle: "Flagship Apex",
    src: "/apps/genesis-v3.mp4",
    durationFormatted: "00:43",
    category: "V3.0 APEX",
    desc: "Flagship generative model with cinematic camera directives.",
  },
  {
    id: "vault-genesis-v2",
    title: "Genesis X V2 AI Canvas & Alchemy",
    subtitle: "Dual-Stage Pipeline",
    src: "/apps/genesis-v2.mp4",
    durationFormatted: "00:40",
    category: "V2.0 PROTOTYPE",
    desc: "Dual-stage Craft & Polish generative visual pipeline.",
  },
  {
    id: "vault-kite-z",
    title: "Kite Z Computer Vision & Structure",
    subtitle: "Aerodynamics",
    src: "/apps/kite-z.mp4",
    durationFormatted: "00:40",
    category: "AERODYNAMICS",
    desc: "Real-time spine analysis, aerodynamic tension & wind advice.",
  },
  {
    id: "vault-nothing-drive",
    title: "Nothing Drive Minimalist GPS HUD",
    subtitle: "GPS Speedometer",
    src: "/apps/nothing-drive.mp4",
    durationFormatted: "00:20",
    category: "GPS HUD",
    desc: "High-contrast monochrome HUD telemetry speedometer.",
  },
  {
    id: "vault-genesis-v1",
    title: "Genesis X V1 Generative Core",
    subtitle: "Generative Core",
    src: "/apps/genesis-v1.mp4",
    durationFormatted: "00:28",
    category: "V1.0 CLASSIC",
    desc: "First-generation neural synthesis core with private vault.",
  },
];

const SPEED_OPTIONS = [0.5, 1, 1.25, 1.5, 2];

interface MotivationalVaultViewProps {
  onClose: () => void;
}

export default function MotivationalVaultView({ onClose }: MotivationalVaultViewProps) {
  const { lockVault } = useSecretLanyard();

  // Player State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [speedIndex, setSpeedIndex] = useState(1); // 1.0x
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = VAULT_PLAYLIST[currentIndex] || VAULT_PLAYLIST[0];

  const showFeedback = (text: string) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setActionFeedback(text);
    feedbackTimeoutRef.current = setTimeout(() => {
      setActionFeedback(null);
    }, 1100);
  };

  // Safe Close Handler: locks the vault & smoothly returns to homepage
  const handleReturn = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    lockVault();
    onClose();
  }, [lockVault, onClose]);

  // Video playback helper
  const playCurrentVideo = useCallback(() => {
    if (!videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay fallback (mute & retry)
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
    }
  }, []);

  // Track change effect: reset timeline and auto-play new active track
  useEffect(() => {
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = SPEED_OPTIONS[speedIndex];
      playCurrentVideo();
    }
  }, [currentIndex, speedIndex, playCurrentVideo]);

  // Toggle Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      playCurrentVideo();
      showFeedback("PLAY");
    } else {
      video.pause();
      setIsPlaying(false);
      showFeedback("PAUSE");
    }
  };

  // Skip time (+/- 10s)
  const skipTime = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
    video.currentTime = newTime;
    setCurrentTime(newTime);
    showFeedback(delta > 0 ? "+10s" : "-10s");
  };

  // Next Track
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VAULT_PLAYLIST.length);
    showFeedback("NEXT TRACK");
  };

  // Previous Track
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VAULT_PLAYLIST.length) % VAULT_PLAYLIST.length);
    showFeedback("PREV TRACK");
  };

  // Shuffle Track: Randomly select another video without repeating current
  const handleShuffle = () => {
    if (VAULT_PLAYLIST.length <= 1) return;
    let nextIdx = currentIndex;
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * VAULT_PLAYLIST.length);
    }
    setCurrentIndex(nextIdx);
    setShuffleKey((prev) => prev + 1); // Triggers Three.js crystal fragment burst!
    showFeedback("SHUFFLED");
  };

  // Cycle Speed
  const cycleSpeed = () => {
    const nextSpeedIdx = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(nextSpeedIdx);
    if (videoRef.current) {
      videoRef.current.playbackRate = SPEED_OPTIONS[nextSpeedIdx];
    }
    showFeedback(`${SPEED_OPTIONS[nextSpeedIdx]}x SPEED`);
  };

  // Toggle Mute / Volume
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.85);
      video.volume = 0.85;
    }
    showFeedback(newMuted ? "MUTED" : "UNMUTED");
  };

  // Seek bar scrub
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  // Native Fullscreen toggle
  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (videoRef.current) {
            const v = Math.min(1, volume + 0.1);
            setVolume(v);
            videoRef.current.volume = v;
            setIsMuted(false);
            videoRef.current.muted = false;
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (videoRef.current) {
            const v = Math.max(0, volume - 0.1);
            setVolume(v);
            videoRef.current.volume = v;
          }
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "n":
        case "N":
          handleNext();
          break;
        case "p":
        case "P":
          handlePrev();
          break;
        case "s":
        case "S":
          handleShuffle();
          break;
        case "l":
        case "L":
          setIsLooping((prev) => !prev);
          break;
        case "Escape":
          handleReturn();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Time format helper: 00:00
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] w-screen h-screen flex flex-col justify-between overflow-y-auto bg-black text-white select-none"
    >
      {/* ── Background: Existing Homepage Silk Video (/background-video.mp4) ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <video
          src="/background-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 filter blur-xs"
        />
        {/* Obsidian dark overlay with subtle crimson atmospheric gradient */}
        <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-2xl" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-red-700/8 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Header Navigation Bar ── */}
      <header className="relative z-20 w-full px-5 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600/30 via-red-950/40 to-black border border-red-500/40 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,31,61,0.3)]">
            <Film className="h-4 w-4 text-primary" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-primary uppercase font-bold">
                PRIVATE VIDEO ARCHIVE // 09
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {currentTrack.title}
            </h1>
          </div>
        </div>

        {/* Action: Return to Homepage Studio */}
        <button
          type="button"
          onClick={handleReturn}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 text-xs sm:text-sm font-mono text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-md active:scale-95 shadow-lg"
          title="Return to VTech Studio Homepage"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 text-primary" />
          <span className="hidden sm:inline">RETURN TO STUDIO</span>
          <span className="sm:hidden">EXIT</span>
        </button>
      </header>

      {/* ── Center Stage: Primary Video Player & Glass Deck ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-4 max-w-5xl mx-auto w-full">
        {/* Primary Video Container */}
        <div
          ref={playerContainerRef}
          className="relative w-full aspect-video max-h-[58vh] rounded-2xl sm:rounded-3xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center group"
        >
          {/* Active Primary Video */}
          <video
            ref={videoRef}
            src={currentTrack.src}
            autoPlay
            loop={isLooping}
            muted={isMuted}
            playsInline
            controls={false}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onEnded={() => {
              if (!isLooping) handleNext();
            }}
            onClick={togglePlay}
            className="w-full h-full object-contain bg-black cursor-pointer"
          />

          {/* Three.js Shuffle Micro-Burst Overlay (Fires dynamically on shuffle click) */}
          <ShuffleBurstCanvas triggerKey={shuffleKey} />

          {/* Transient Action Feedback HUD Pill */}
          <AnimatePresence>
            {actionFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute z-30 px-4 py-2 rounded-xl bg-black/85 border border-primary/50 text-white font-mono text-xs font-bold tracking-widest backdrop-blur-md shadow-2xl flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>{actionFeedback}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Overlay: Track Category Pill */}
          <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-black/70 border border-white/10 text-[10px] font-mono font-semibold text-primary tracking-wider uppercase backdrop-blur-md">
              {currentTrack.category}
            </span>
            <span className="hidden sm:inline px-2 py-1 rounded-full bg-black/50 text-[10px] font-mono text-neutral-400 backdrop-blur-md">
              TRACK {String(currentIndex + 1).padStart(2, "0")} / {String(VAULT_PLAYLIST.length).padStart(2, "0")}
            </span>
          </div>

          {/* Big Center Play/Pause button on hover when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute z-20 h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-primary/90 hover:bg-primary border border-white/30 text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,31,61,0.6)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
              aria-label="Play video"
            >
              <Play className="h-8 w-8 ml-1" fill="currentColor" />
            </button>
          )}
        </div>

        {/* ── Control Console Panel (iOS Glass Style) ── */}
        <div className="w-full mt-4 rounded-2xl border border-white/12 bg-neutral-950/80 backdrop-blur-2xl p-3 sm:p-4 shadow-xl flex flex-col gap-3">
          {/* 1. Timeline & Scrub Bar */}
          <div className="w-full flex items-center gap-3 font-mono text-xs text-neutral-400">
            <span className="w-11 text-right text-neutral-300 tabular-nums">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center group py-1 cursor-pointer">
              {/* Background Track */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                {/* Active Progress Fill */}
                <div
                  className="h-full bg-gradient-to-r from-primary to-[#ff4760] transition-all duration-100 rounded-full shadow-[0_0_10px_#ff1f3d]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Range Input for Precision Seeking */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek timeline"
              />
            </div>

            <span className="w-11 text-left text-neutral-400 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* 2. Main Playback Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
            {/* Left Controls: Shuffle & Skips */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Three.js Shuffle Button */}
              <button
                type="button"
                onClick={handleShuffle}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/25 border border-primary/40 text-primary hover:text-white font-mono text-xs transition-all cursor-pointer shadow-[0_0_12px_rgba(255,31,61,0.25)] active:scale-95"
                title="Shuffle Playlist with 3D crystal burst (Key: S)"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline font-semibold">SHUFFLE</span>
              </button>

              {/* Skip -10s */}
              <button
                type="button"
                onClick={() => skipTime(-10)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Rewind 10 seconds (Key: Left Arrow)"
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Prev Video */}
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Previous Video (Key: P)"
                aria-label="Previous video"
              >
                <SkipBack className="h-4 w-4" />
              </button>
            </div>

            {/* Center Controls: Big Play / Pause */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-primary hover:bg-[#ff3350] border border-white/30 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,31,61,0.5)] transition-all cursor-pointer active:scale-95"
                title="Play/Pause (Key: Space)"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                )}
              </button>

              {/* Next Video */}
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Next Video (Key: N)"
                aria-label="Next video"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Skip +10s */}
              <button
                type="button"
                onClick={() => skipTime(10)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Forward 10 seconds (Key: Right Arrow)"
                aria-label="Forward 10 seconds"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            {/* Right Controls: Loop, Speed, Audio, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Loop Toggle */}
              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isLooping
                    ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_12px_rgba(255,31,61,0.3)]"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                }`}
                title={isLooping ? "Loop Active (Key: L)" : "Loop Inactive (Key: L)"}
                aria-label="Toggle loop"
              >
                {isLooping ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
              </button>

              {/* Playback Speed */}
              <button
                type="button"
                onClick={cycleSpeed}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                title="Playback Speed"
              >
                <Gauge className="h-3 w-3 text-primary" />
                <span>{SPEED_OPTIONS[speedIndex]}x</span>
              </button>

              {/* Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title={isMuted ? "Unmute (Key: M)" : "Mute (Key: M)"}
                aria-label="Toggle audio"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-primary" />
                )}
              </button>

              {/* Native Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Toggle Fullscreen"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Bottom Section: Horizontal Playlist Tray ── */}
      <footer className="relative z-20 w-full px-5 sm:px-8 py-3 border-t border-white/10 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            <span className="flex items-center gap-1.5 text-white">
              <Layers className="h-3 w-3 text-primary" />
              <span>Available Archives ({VAULT_PLAYLIST.length})</span>
            </span>
            <span className="text-neutral-500 hidden sm:inline">
              CLICK ANY CLIP TO LOAD INSTANTLY
            </span>
          </div>

          {/* Scrollable Playlist Cards */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {VAULT_PLAYLIST.map((track, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-primary/20 border-primary/60 text-white shadow-[0_0_15px_rgba(255,31,61,0.25)]"
                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
                  }`}
                >
                  <div className="relative h-7 w-7 rounded-lg bg-black/70 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {isSelected ? (
                      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    ) : (
                      <Film className="h-3.5 w-3.5 text-neutral-500" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 pr-1">
                    <span
                      className={`text-xs font-semibold truncate max-w-[170px] ${
                        isSelected ? "text-white" : "text-neutral-300"
                      }`}
                    >
                      {track.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                      <span className="text-primary">{track.category}</span>
                      <span>•</span>
                      <span>{track.durationFormatted}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
