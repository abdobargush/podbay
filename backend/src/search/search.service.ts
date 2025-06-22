import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { VendorRegistry } from '../vendor/vendor.registery';
import {
  VendorArtist,
  VendorEnum,
  VendorEpisode,
  VendorPodcast,
} from '../vendor/vendor.types';
import { PodcastService } from '../podcast/podcast.service';
import { ArtistService } from '../artist/artist.service';
import { EpisodeService } from '../episode/episode.service';
import { plainToInstance } from 'class-transformer';
import { EpisodeResponseDto } from '../episode/dto/episode-response.dto';
import { PodcastResponseDto } from '../podcast/dto/podcast-response.dto';

@Injectable()
export class SearchService {
  constructor(
    private podcastVendor: VendorRegistry,
    private podcastService: PodcastService,
    private episodeService: EpisodeService,
    private artistService: ArtistService,
  ) {}

  async search({ term, limit }: SearchQueryDto) {
    let podcasts: VendorPodcast[] = [];
    let episodes: VendorEpisode[] = [];
    try {
      [podcasts, episodes] = await Promise.all([
        this.podcastVendor.get(VendorEnum.ITUNES).searchPodcasts(term),
        this.podcastVendor.get(VendorEnum.ITUNES).searchEpisodes(term),
      ]);
    } catch (error) {
      console.error(`Failed to fetch from vendor: ${VendorEnum.ITUNES}`, error);
    }

    try {
      await this.storePodcasts(podcasts);
    } catch (error) {
      console.error('Failed to store podcasts.', error);
    }

    try {
      await this.storeEpisodes(episodes);
    } catch (error) {
      console.error('Failed to store episodes.', error);
    }

    const responsePodcasts = await this.podcastService.search(term, limit);
    const responseEpisodes = await this.episodeService.search(term, limit);

    return {
      podcasts: plainToInstance(PodcastResponseDto, responsePodcasts),
      episodes: plainToInstance(EpisodeResponseDto, responseEpisodes),
    };
  }

  /**
   * This verison makes use of bulk operations
   * It's O(1) on the database level which gives potential performance gains
   */
  private async storePodcasts(podcasts: VendorPodcast[]) {
    const artists = podcasts
      .filter((podcast) => podcast.vendorArtist?.vendorId)
      .map((podcast) => podcast.vendorArtist as VendorArtist);
    const storedArtists = await this.artistService.insertAndFetchBulkByVendor(
      VendorEnum.ITUNES,
      artists,
    );

    const artistsMap = new Map(
      storedArtists.map((artist) => [artist.vendorId, artist.id]),
    );

    await this.podcastService.insertAndFetchBulkByVendor(
      VendorEnum.ITUNES,
      podcasts.map((podcast) => ({
        ...podcast,
        artistId: podcast.vendorArtist
          ? artistsMap.get(podcast.vendorArtist.vendorId)
          : undefined,
      })),
    );
  }

  /**
   * This version makes use of sequential operations
   * It's O(n) on the database level but it's straightforward logic
   * And has the upside of handling one record at a time which is better for error handling
   */
  // private async storePodcasts(podcasts: VendorPodcast[]) {
  //   for (const fetchedPodcast of podcasts) {
  //     try {
  //       // Find or create the artist
  //       let artistId: number | undefined = undefined;
  //       if (
  //         fetchedPodcast.vendorArtist &&
  //         fetchedPodcast.vendorArtist.vendorId
  //       ) {
  //         const artist = await this.artistService.firstOrCreateByVendorId(
  //           fetchedPodcast.vendorArtist.vendorId,
  //           fetchedPodcast.vendor,
  //           fetchedPodcast.vendorArtist,
  //         );

  //         artistId = artist.id;
  //       }

  //       // Find or create the podcast
  //       await this.podcastService.firstOrCreateByVendorId(
  //         fetchedPodcast.vendorId,
  //         fetchedPodcast.vendor,
  //         {
  //           ...fetchedPodcast,
  //           artistId,
  //         },
  //       );
  //     } catch (error) {
  //       console.error(
  //         `Failed to store podcast: ${fetchedPodcast.vendorId} from ${fetchedPodcast.vendor}`,
  //         error,
  //       );
  //     }
  //   }
  // }

  /**
   * This verison makes use of bulk operations
   * It's O(1) on the database level which gives potential performance gains
   */
  private async storeEpisodes(episodes: VendorEpisode[]) {
    const podcasts = episodes
      .filter((episode) => episode.vendorPodcast?.vendorId)
      .map((episode) => episode.vendorPodcast as VendorPodcast);
    const storedPodcasts = await this.podcastService.insertAndFetchBulkByVendor(
      VendorEnum.ITUNES,
      podcasts,
    );

    const podcastsMap = new Map(
      storedPodcasts.map((podcast) => [podcast.vendorId, podcast.id]),
    );

    await this.episodeService.insertAndFetchBulkByVendor(
      VendorEnum.ITUNES,
      episodes.map((episode) => ({
        ...episode,
        podcastId: episode.vendorPodcast
          ? podcastsMap.get(episode.vendorPodcast.vendorId)
          : undefined,
      })),
    );
  }

  /**
   * This version makes use of sequential operations
   * It's O(n) on the database level but it's straightforward logic
   * And has the upside of handling one record at a time which is better for error handling
   */
  // private async storeEpisodes(episodes: VendorEpisode[]) {
  //   for (const fetchedEpisode of episodes) {
  //     try {
  //       // Find or create the podcast
  //       let podcastId: number | undefined = undefined;
  //       if (
  //         fetchedEpisode.vendorPodcast &&
  //         fetchedEpisode.vendorPodcast.vendorId
  //       ) {
  //         const podcast = await this.podcastService.firstOrCreateByVendorId(
  //           fetchedEpisode.vendorPodcast.vendorId,
  //           fetchedEpisode.vendorPodcast.vendor,
  //           fetchedEpisode.vendorPodcast,
  //         );

  //         podcastId = podcast.id;
  //       }

  //       // Find or create the episode
  //       await this.episodeService.firstOrCreateByVendorId(
  //         fetchedEpisode.vendorId,
  //         fetchedEpisode.vendor,
  //         { ...fetchedEpisode, podcastId },
  //       );
  //     } catch (error) {
  //       console.error(
  //         `Failed to store episode: ${fetchedEpisode.vendorId} from ${fetchedEpisode.vendor}`,
  //         error,
  //       );
  //     }
  //   }
  // }
}
