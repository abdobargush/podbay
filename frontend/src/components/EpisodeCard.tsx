import useRandomColorHelper from "@/hooks/useRandomColorHelper";
import { cn } from "@/lib/utils";
import { Episode, LayoutOptions } from "@/types";
import dayjs from "@/lib/dayjs";
import Image from "next/image";
import { useMemo } from "react";
import { usePlayer } from "./Player";

const EpisodeCard = ({
  episode,
  activeLayoutOption = LayoutOptions.GRID,
}: {
  episode: Episode;
  activeLayoutOption?: LayoutOptions;
}) => {
  const { setCurrentEpisode, togglePlayPause, currentEpisode, isPlaying } =
    usePlayer();
  const { background, color } = useRandomColorHelper(episode.id);

  const duration = useMemo(() => {
    const totalSeconds = Math.floor(episode.durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }, [episode.durationMillis]);

  const handleEpisodePlayPause = () => {
    if (currentEpisode?.id !== episode.id) {
      setCurrentEpisode(episode);
    }
    togglePlayPause();
  };

  return (
    <div
      className={cn(
        `flex bg-gradient-to-b transition-colors duration-150 rounded`,
        background
      )}
    >
      <button
        className="relative cursor-pointer group overflow-hidden rounded-r"
        onClick={handleEpisodePlayPause}
      >
        <div className="absolute flex inset-0 w-full h-full items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {isPlaying && currentEpisode?.id === episode.id ? (
            <i className="hn hn-pause-solid text-2xl"></i>
          ) : (
            <i className="hn hn-play-solid text-2xl"></i>
          )}
        </div>
        <Image
          src={episode.artwork}
          alt={episode.name}
          width={activeLayoutOption === LayoutOptions.GRID ? 108 : 186}
          height={activeLayoutOption === LayoutOptions.GRID ? 108 : 186}
          className={cn({
            "h-42 w-42 md:h-[186px] md:w-[186px]":
              activeLayoutOption === LayoutOptions.LIST,
            "h-[108px] w-[108px]": activeLayoutOption === LayoutOptions.GRID,
          })}
        />
      </button>
      <div
        className={cn("flex-1 flex flex-col overflow-hidden", {
          "p-2 pr-4": activeLayoutOption === LayoutOptions.GRID,
          "p-4 pr-6": activeLayoutOption === LayoutOptions.LIST,
        })}
      >
        <h3 className="text-lg font-bold truncate">
          <a href={episode.link} target="_blank" className="">
            {episode.name}
          </a>
        </h3>
        <a
          href={episode.podcast?.link}
          target="_blank"
          className={cn(
            `block truncate underline underline-offset-2 transition-colors duration-150`,
            color
          )}
        >
          {episode.podcast?.name}
        </a>

        {activeLayoutOption === LayoutOptions.LIST && (
          <p className="line-clamp-2 mt-2">{episode.description}</p>
        )}

        <div className="flex items-center text-sm mt-auto space-x-3">
          <span>{dayjs(episode.releaseDate).format("D MMM")}</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
