import { Artist } from 'src/artist/entities/artist.entity';
import { Episode } from 'src/episode/entities/episode.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';

export enum VendorEnum {
  ITUNES = 'itunes',
}

export type VendorArtist = Pick<
  Artist,
  'name' | 'link' | 'vendor' | 'vendorId'
>;

export type VendorPodcast<T = unknown> = Omit<
  Podcast<T>,
  'id' | 'artist' | 'artistId' | 'episodes' | 'createdAt' | 'updatedAt'
> & {
  vendorArtist?: VendorArtist;
};

export type VendorEpisode<T = unknown> = Omit<
  Episode<T>,
  'id' | 'podcast' | 'podcastId' | 'createdAt' | 'updatedAt'
> & {
  vendorPodcast?: VendorPodcast;
};

export interface Vendor<T = unknown> {
  name: VendorEnum;
  url: string;
  searchPodcasts(term: string): Promise<VendorPodcast<T>[]>;
  searchEpisodes(term: string): Promise<VendorEpisode<T>[]>;
}
