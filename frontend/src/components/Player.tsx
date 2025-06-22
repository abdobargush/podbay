"use client";

import { Episode } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Image from "next/image";

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  setCurrentEpisode: (episode: Episode | null) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!currentEpisode) return;

    play();
  }, [currentEpisode]);

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        setCurrentEpisode,
        togglePlayPause,
        play,
        pause,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

const Player = () => {
  const { currentEpisode, isPlaying, play, pause } = usePlayer();

  const playerRef = useRef<AudioPlayer | null>(null);
  useEffect(() => {
    const audio = playerRef.current?.audio.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <div className="h-24">
      <div
        className="flex flex-row-reverse fixed bottom-0 w-full right-0 bg-background/90 backdrop-blur-xl border-t border-t-neutral-700"
        dir="ltr"
      >
        {currentEpisode && (
          <div
            className="flex items-center p-4 border-l border-neutral-700 md:space-x-2 md:w-48 shrink-0"
            dir="rtl"
          >
            <Image
              src={currentEpisode.artwork as string}
              width={50}
              height={50}
              className="rounded"
              alt={currentEpisode.name}
            />
            <div className="overflow-hidden hidden md:block">
              <h4 className="font-bold truncate">{currentEpisode.name}</h4>
              <p className="text-foreground/70 truncate">
                {currentEpisode?.podcast?.name}
              </p>
            </div>
          </div>
        )}
        <AudioPlayer
          ref={playerRef}
          layout="stacked"
          src={currentEpisode?.fileUrl}
          onPlay={play}
          onPause={pause}
          showJumpControls={false}
        />
      </div>
    </div>
  );
};

export default Player;
