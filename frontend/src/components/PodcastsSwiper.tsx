"use client";

import { Podcast } from "@/types";
import PodcastCard from "./PodcastCard";
import { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PodcastsSwiper = ({
  podcasts,
  term,
}: {
  podcasts: Podcast[];
  term?: string;
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">
          أكثر البودكاست مطابقة {`ل "${term}"`}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-150"
          >
            <i className="hn hn-angle-right-solid"></i>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-150"
          >
            <i className="hn hn-angle-left-solid"></i>
          </button>
        </div>
      </div>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={"auto"}
        spaceBetween={16}
        freeMode={true}
        modules={[FreeMode, Pagination]}
        pagination={{
          type: "progressbar",
          el: ".custom-swiper-progressbar",
        }}
        className="mt-4"
      >
        <AnimatePresence mode="wait">
          {podcasts.map((podcast, idx) => (
            <SwiperSlide key={podcast.id} className="!w-[264px] !h-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <PodcastCard podcast={podcast} />
              </motion.div>
            </SwiperSlide>
          ))}
        </AnimatePresence>
      </Swiper>

      <div className="custom-swiper-progressbar !relative h-1 !bg-neutral-800 rounded mt-4 w-full overflow-hidden"></div>
    </div>
  );
};

export default PodcastsSwiper;
