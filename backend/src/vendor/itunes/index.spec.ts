import { ItunesVendor } from '.';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { VendorEnum } from '../vendor.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ItunesVendor', () => {
  let itunesVendor: ItunesVendor;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('https://itunes.apple.com/search'),
    };

    itunesVendor = new ItunesVendor(configService as ConfigService);
  });

  describe('searchPodcasts', () => {
    it('should call iTunes API with correct params and return transformed podcasts', async () => {
      const term = 'startup';
      const mockData = {
        results: [
          {
            artistName: 'Artist Name',
            artistViewUrl: 'https://artist.url',
            artistId: 123,
            collectionName: 'My Podcast',
            feedUrl: 'https://feed.url',
            collectionViewUrl: 'https://collection.url',
            artworkUrl100: 'https://img.com/art100.jpg',
            artworkUrl160: 'https://img.com/art160.jpg',
            collectionId: 456,
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await itunesVendor.searchPodcasts(term);

      const getSpy = jest.spyOn(axios, 'get');
      expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `term=${encodeURIComponent(term)}&entity=podcast`,
        ),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          name: 'My Podcast',
          feedUrl: 'https://feed.url',
          vendor: VendorEnum.ITUNES,
          vendorId: '456',
          // vendorArtist: expect.objectContaining({
          //   name: 'Artist Name',
          //   vendorId: '123',
          //   vendor: VendorEnum.ITUNES,
          // }),
        }),
      );
    });

    it('should throw an error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Request failed'));

      await expect(itunesVendor.searchPodcasts('fail')).rejects.toThrow(
        'Request failed',
      );
    });
  });

  describe('searchEpisodes', () => {
    it('should call iTunes API with correct params and return transformed episodes', async () => {
      const term = 'founders';
      const mockData = {
        results: [
          {
            trackName: 'Episode Title',
            description: 'Great episode',
            trackViewUrl: 'https://episode.url',
            releaseDate: '2024-01-01T00:00:00Z',
            trackTimeMillis: 1200000,
            episodeFileExtension: 'mp3',
            artworkUrl160: 'https://img.com/ep.jpg',
            trackId: 789,
            // required for vendorPodcast
            artistName: 'Artist A',
            artistViewUrl: 'https://artist.a',
            artistId: 111,
            collectionName: 'Podcast A',
            feedUrl: 'https://feed.a',
            collectionViewUrl: 'https://collection.a',
            artworkUrl100: 'https://img.com/100.jpg',
            collectionId: 222,
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await itunesVendor.searchEpisodes(term);

      const getSpy = jest.spyOn(axios, 'get');
      expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `term=${encodeURIComponent(term)}&entity=podcastEpisode`,
        ),
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          name: 'Episode Title',
          vendorId: '789',
          durationMillis: 1200000,
          // vendorPodcast: expect.objectContaining({
          //   name: 'Podcast A',
          //   vendorId: '222',
          //   vendorArtist: expect.objectContaining({
          //     name: 'Artist A',
          //     vendorId: '111',
          //   }),
          // }),
        }),
      );
    });

    it('should throw an error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Failed to fetch episodes'));

      await expect(itunesVendor.searchEpisodes('fail')).rejects.toThrow(
        'Failed to fetch episodes',
      );
    });
  });
});
