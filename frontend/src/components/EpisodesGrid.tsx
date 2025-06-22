"use client";

import { Episode, LayoutOptions } from "@/types";
import EpisodeCard from "./EpisodeCard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const EpisodesGrid = ({
  term,
  episodes,
}: {
  term?: string;
  episodes: Episode[];
}) => {
  const [layout, setLayout] = useState<LayoutOptions>(LayoutOptions.GRID);

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">
          أكثر الحلقات مطابقة {`ل "${term}"`}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLayout(LayoutOptions.GRID)}
            className={cn(
              "opacity-50 hover:opacity-80 cursor-pointer transition-opacity duration-150",
              {
                "opacity-100": layout === LayoutOptions.GRID,
              }
            )}
          >
            <i className="hn hn-grid-solid"></i>
          </button>
          <button
            onClick={() => setLayout(LayoutOptions.LIST)}
            className={cn(
              "opacity-50 hover:opacity-80 cursor-pointer transition-opacity duration-150",
              {
                "opacity-100": layout === LayoutOptions.LIST,
              }
            )}
          >
            <i className="hn hn-bars-solid"></i>
          </button>
        </div>
      </div>
      <div
        className={cn("grid gap-6 mt-4", {
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3":
            layout === LayoutOptions.GRID,
          "grid-cols-1": layout === LayoutOptions.LIST,
        })}
      >
        <AnimatePresence mode="popLayout">
          {episodes.map((episode, idx) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.35,
                delay: idx * 0.05,
                ease: "easeOut",
              }}
            >
              <EpisodeCard episode={episode} activeLayoutOption={layout} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default EpisodesGrid;
