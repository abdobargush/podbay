import api from "@/api";
import EmptyState from "@/components/EmptyState";
import EpisodesGrid from "@/components/EpisodesGrid";
import PodcastsSwiper from "@/components/PodcastsSwiper";
import { Episode, Podcast, SearchResponse } from "@/types";

async function search(term: string): Promise<SearchResponse> {
  const response = await api.get(`/search?term=${encodeURIComponent(term)}`);
  return response.data;
}

type Props = {
  searchParams: Promise<{ term?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { term } = await searchParams;
  let podcasts: Podcast[] = [];
  let episodes: Episode[] = [];
  if (term && term.length > 2) {
    const { podcasts: fetchedPodcasts, episodes: fetchedEpisodes } =
      await search(term);
    podcasts = fetchedPodcasts;
    episodes = fetchedEpisodes;
  }

  const isEmpty = podcasts.length === 0 && episodes.length === 0;

  return (
    <>
      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="px-4 md:px-8">
          {podcasts.length > 0 && (
            <section className="py-8">
              <PodcastsSwiper term={term} podcasts={podcasts} />
            </section>
          )}

          {episodes.length > 0 && (
            <section className="py-8">
              <EpisodesGrid term={term} episodes={episodes} />
            </section>
          )}
        </div>
      )}
    </>
  );
}
