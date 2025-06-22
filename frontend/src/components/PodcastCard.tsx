import useRandomColorHelper from "@/hooks/useRandomColorHelper";
import { cn } from "@/lib/utils";
import { Podcast } from "@/types";
import Image from "next/image";

const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const { color, background } = useRandomColorHelper(podcast.id);

  return (
    <div className={cn("h-full p-2 rounded bg-gradient-to-tl", background)}>
      <a href={podcast.link} target="_blank">
        <Image
          src={podcast.artwork ?? ""}
          alt="Podcast Image"
          width={320}
          height={320}
          className="rounded"
        />
      </a>
      <div className="mt-2 overflow-hidden">
        <h3 className="text-lg font-bold truncate">
          <a href={podcast.link} target="_blank">
            {podcast.name}
          </a>
        </h3>
        {podcast.artist && (
          <a
            href={podcast.artist?.link}
            target="_blank"
            className={cn("inline-block underline underline-offset-2", color)}
          >
            {podcast.artist?.name}
          </a>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
