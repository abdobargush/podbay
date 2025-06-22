import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import {
  Vendor,
  VendorArtist,
  VendorEnum,
  VendorEpisode,
  VendorPodcast,
} from '../vendor.types';
import { ItunesResponse, ItunesResult } from './dto/itunes.dto';

@Injectable()
export class ItunesVendor implements Vendor<ItunesResult> {
  name = VendorEnum.ITUNES;

  url = '';

  constructor(private configService: ConfigService) {
    this.url = this.configService.get<string>(
      'ITUNES_API_URL',
      'https://itunes.apple.com/search',
    );
  }

  private transformArtist(data: ItunesResult): VendorArtist {
    return {
      name: data.artistName,
      link: data.artistViewUrl,
      vendor: this.name,
      vendorId: data.artistId?.toString(),
    };
  }

  private transformPodcast(data: ItunesResult): VendorPodcast<ItunesResult> {
    return {
      name: data.collectionName,
      feedUrl: data.feedUrl,
      link: data.collectionViewUrl,
      artwork: data.artworkUrl600 ?? data.artworkUrl160,
      vendor: this.name,
      vendorId: data.collectionId.toString(),
      vendorArtist: this.transformArtist(data),
      vendorMetadata: data,
    };
  }

  private transformEpisode(data: ItunesResult): VendorEpisode<ItunesResult> {
    return {
      name: data.trackName,
      description: data.description,
      link: data.trackViewUrl,
      releaseDate: new Date(data.releaseDate),
      durationMillis: data.trackTimeMillis,
      fileUrl: data.episodeUrl,
      fileExtention: data.episodeFileExtension,
      artwork: data.artworkUrl160,
      vendor: this.name,
      vendorId: data.trackId.toString(),
      vendorPodcast: this.transformPodcast(data),
      vendorMetadata: data,
    };
  }

  async searchPodcasts(term: string): Promise<VendorPodcast<ItunesResult>[]> {
    return axios
      .get(`${this.url}?term=${encodeURIComponent(term)}&entity=podcast`)
      .then((response) => {
        const data: ItunesResponse = response.data as ItunesResponse;
        const podcasts: VendorPodcast<ItunesResult>[] = data.results.map(
          (result) => this.transformPodcast(result),
        );

        return podcasts;
      })
      .catch((error: AxiosError) => {
        throw new Error(error.message || 'Unknown error');
      });
  }

  async searchEpisodes(term: string): Promise<VendorEpisode<ItunesResult>[]> {
    return axios
      .get(`${this.url}?term=${encodeURIComponent(term)}&entity=podcastEpisode`)
      .then((response) => {
        const data: ItunesResponse = response.data as ItunesResponse;
        const episodes: VendorEpisode<ItunesResult>[] = data.results.map(
          (result) => this.transformEpisode(result),
        );

        return episodes;
      })
      .catch((error: AxiosError) => {
        throw new Error(error.message || 'Unknown error');
      });
  }
}
