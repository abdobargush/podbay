import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { VendorRegistry } from '../vendor/vendor.registery';
import { PodcastService } from '../podcast/podcast.service';
import { ArtistService } from '../artist/artist.service';
import { EpisodeService } from '../episode/episode.service';
import { SearchQueryDto } from './dto/search-query.dto';
import {
  VendorEnum,
  VendorPodcast,
  VendorEpisode,
} from '../vendor/vendor.types';
import { PodcastResponseDto } from 'src/podcast/dto/podcast-response.dto';
import { EpisodeResponseDto } from 'src/episode/dto/episode-response.dto';

describe('SearchService', () => {
  let service: SearchService;
  let vendorRegistry: jest.Mocked<VendorRegistry>;
  let podcastService: jest.Mocked<PodcastService>;
  let artistService: jest.Mocked<ArtistService>;
  let episodeService: jest.Mocked<EpisodeService>;

  const mockVendor = {
    searchPodcasts: jest.fn(),
    searchEpisodes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: VendorRegistry,
          useValue: {
            get: jest.fn().mockReturnValue(mockVendor),
          },
        },
        {
          provide: PodcastService,
          useValue: {
            search: jest.fn(),
            insertAndFetchBulkByVendor: jest.fn(),
            firstOrCreateByVendorId: jest.fn(),
          },
        },
        {
          provide: ArtistService,
          useValue: {
            insertAndFetchBulkByVendor: jest.fn(),
            firstOrCreateByVendorId: jest.fn(),
          },
        },
        {
          provide: EpisodeService,
          useValue: {
            search: jest.fn(),
            insertAndFetchBulkByVendor: jest.fn(),
            firstOrCreateByVendorId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    vendorRegistry = module.get(VendorRegistry);
    podcastService = module.get(PodcastService);
    artistService = module.get(ArtistService);
    episodeService = module.get(EpisodeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    const mockSearchQuery: SearchQueryDto = {
      term: 'test podcast',
      limit: 10,
    };

    const mockVendorPodcasts: VendorPodcast[] = [
      {
        vendorId: 'podcast1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 1',
        vendorArtist: {
          vendorId: 'artist1',
          vendor: VendorEnum.ITUNES,
          name: 'Test Artist 1',
        },
      },
      {
        vendorId: 'podcast2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 2',
        vendorArtist: {
          vendorId: 'artist2',
          vendor: VendorEnum.ITUNES,
          name: 'Test Artist 2',
        },
      },
    ];

    const mockVendorEpisodes: VendorEpisode[] = [
      {
        vendorId: 'episode1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Episode 1',
        description: 'Test Episode Description 1',
        link: 'https://example.com/episode1',
        artwork: 'https://example.com/artwork1.jpg',
        fileExtention: 'mp3',
        durationMillis: 300000,
        releaseDate: new Date('2024-01-01'),
        vendorPodcast: {
          vendorId: 'podcast1',
          vendor: VendorEnum.ITUNES,
          name: 'Test Podcast 1',
        },
      },
      {
        vendorId: 'episode2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Episode 2',
        description: 'Test Episode Description 2',
        link: 'https://example.com/episode2',
        artwork: 'https://example.com/artwork2.jpg',
        fileExtention: 'mp3',
        durationMillis: 450000,
        releaseDate: new Date('2024-01-02'),
        vendorPodcast: {
          vendorId: 'podcast2',
          vendor: VendorEnum.ITUNES,
          name: 'Test Podcast 2',
        },
      },
    ];

    const mockStoredArtists = [
      {
        id: 1,
        vendorId: 'artist1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Artist 1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        podcasts: [],
      },
      {
        id: 2,
        vendorId: 'artist2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Artist 2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        podcasts: [],
      },
    ];

    const mockStoredPodcasts = [
      {
        id: 1,
        vendorId: 'podcast1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        episodes: [],
        artist: mockStoredArtists[0],
      },
      {
        id: 2,
        vendorId: 'podcast2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        episodes: [],
        artist: mockStoredArtists[1],
      },
    ];

    const mockResponsePodcasts = [
      {
        id: 1,
        vendorId: 'podcast1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        episodes: [],
        artist: mockStoredArtists[0],
      },
      {
        id: 2,
        vendorId: 'podcast2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Podcast 2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        episodes: [],
        artist: mockStoredArtists[1],
      },
    ];

    const mockResponseEpisodes = [
      {
        id: 1,
        vendorId: 'episode1',
        vendor: VendorEnum.ITUNES,
        name: 'Test Episode 1',
        description: 'Test Episode Description 1',
        link: 'https://example.com/episode1',
        artwork: 'https://example.com/artwork1.jpg',
        fileExtention: 'mp3',
        durationMillis: 300000,
        releaseDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        podcast: mockStoredPodcasts[0],
        podcastId: 1,
      },
      {
        id: 2,
        vendorId: 'episode2',
        vendor: VendorEnum.ITUNES,
        name: 'Test Episode 2',
        description: 'Test Episode Description 2',
        link: 'https://example.com/episode2',
        artwork: 'https://example.com/artwork2.jpg',
        fileExtention: 'mp3',
        durationMillis: 450000,
        releaseDate: new Date('2024-01-02'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        podcast: mockStoredPodcasts[1],
        podcastId: 2,
      },
    ];

    beforeEach(() => {
      mockVendor.searchPodcasts.mockResolvedValue(mockVendorPodcasts);
      mockVendor.searchEpisodes.mockResolvedValue(mockVendorEpisodes);
      artistService.insertAndFetchBulkByVendor.mockResolvedValue(
        mockStoredArtists,
      );
      podcastService.insertAndFetchBulkByVendor.mockResolvedValue(
        mockStoredPodcasts,
      );
      podcastService.search.mockResolvedValue(mockResponsePodcasts);
      episodeService.search.mockResolvedValue(mockResponseEpisodes);
    });

    it('should successfully search and return podcasts and episodes', async () => {
      const result = await service.search(mockSearchQuery);

      const mockVendorGet = jest.spyOn(vendorRegistry, 'get');
      expect(mockVendorGet).toHaveBeenCalledWith(VendorEnum.ITUNES);
      expect(mockVendor.searchPodcasts).toHaveBeenCalledWith(
        mockSearchQuery.term,
      );
      expect(mockVendor.searchEpisodes).toHaveBeenCalledWith(
        mockSearchQuery.term,
      );

      const mockArtistInsertAndFetchBulkByVendor = jest.spyOn(
        artistService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockArtistInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        mockVendorPodcasts.map((p) => p.vendorArtist),
      );

      const mockPodcastInsertAndFetchBulkByVendor = jest.spyOn(
        podcastService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockPodcastInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        mockVendorPodcasts.map((p) => ({
          ...p,
          artistId: mockStoredArtists.find(
            (a) => a.vendorId === p.vendorArtist?.vendorId,
          )?.id,
        })),
      );

      const mockPodcastSearch = jest.spyOn(podcastService, 'search');
      expect(mockPodcastSearch).toHaveBeenCalledWith(
        mockSearchQuery.term,
        mockSearchQuery.limit,
      );

      const mockEpisodeSearch = jest.spyOn(episodeService, 'search');
      expect(mockEpisodeSearch).toHaveBeenCalledWith(
        mockSearchQuery.term,
        mockSearchQuery.limit,
      );

      expect(result).toEqual({
        podcasts: expect.any(Array) as unknown as PodcastResponseDto[],
        episodes: expect.any(Array) as unknown as PodcastResponseDto[],
      });
    });

    it('should handle vendor search failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockVendor.searchPodcasts.mockRejectedValue(new Error('Vendor error'));
      mockVendor.searchEpisodes.mockRejectedValue(new Error('Vendor error'));

      const result = await service.search(mockSearchQuery);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Failed to fetch from vendor: ${VendorEnum.ITUNES}`,
        expect.any(Error),
      );

      expect(result).toEqual({
        podcasts: expect.any(Array) as unknown as PodcastResponseDto[],
        episodes: expect.any(Array) as unknown as PodcastResponseDto[],
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle podcast storage failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      artistService.insertAndFetchBulkByVendor.mockRejectedValue(
        new Error('Storage error'),
      );

      const result = await service.search(mockSearchQuery);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to store podcasts.',
        expect.any(Error),
      );

      expect(result).toEqual({
        podcasts: expect.any(Array) as unknown as PodcastResponseDto[],
        episodes: expect.any(Array) as unknown as EpisodeResponseDto[],
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle episode storage failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      podcastService.insertAndFetchBulkByVendor.mockRejectedValueOnce(
        mockStoredPodcasts,
      );
      podcastService.insertAndFetchBulkByVendor.mockRejectedValueOnce(
        new Error('Storage error'),
      );

      const result = await service.search(mockSearchQuery);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to store episodes.',
        expect.any(Error),
      );

      expect(result).toEqual({
        podcasts: expect.any(Array) as unknown as PodcastResponseDto[],
        episodes: expect.any(Array) as unknown as EpisodeResponseDto[],
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle podcasts without vendor artists', async () => {
      const podcastsWithoutArtists: VendorPodcast[] = [
        {
          vendorId: 'podcast1',
          vendor: VendorEnum.ITUNES,
          name: 'Test Podcast 1',
          vendorArtist: undefined,
        },
        {
          vendorId: 'podcast2',
          vendor: VendorEnum.ITUNES,
          name: 'Test Podcast 2',
          vendorArtist: {
            vendorId: undefined as unknown as string,
            vendor: VendorEnum.ITUNES,
            name: 'Test Artist 2',
          },
        },
      ];

      mockVendor.searchPodcasts.mockResolvedValue(podcastsWithoutArtists);
      artistService.insertAndFetchBulkByVendor.mockResolvedValue([]);

      await service.search(mockSearchQuery);

      const mockArtistInsertAndFetchBulkByVendor = jest.spyOn(
        artistService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockArtistInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        [],
      );

      const mockPodcastInsertAndFetchBulkByVendor = jest.spyOn(
        podcastService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockPodcastInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        podcastsWithoutArtists.map((p) => ({
          ...p,
          artistId: undefined,
        })),
      );
    });

    it('should handle episodes without vendor podcasts', async () => {
      const episodesWithoutPodcasts: VendorEpisode[] = [
        {
          vendorId: 'episode1',
          vendor: VendorEnum.ITUNES,
          name: 'Test Episode 1',
          description: 'Test Episode Description 1',
          link: 'https://example.com/episode1',
          artwork: 'https://example.com/artwork1.jpg',
          fileExtention: 'mp3',
          durationMillis: 300000,
          releaseDate: new Date('2024-01-01'),
          vendorPodcast: undefined,
        },
        {
          vendorId: 'episode2',
          vendor: VendorEnum.ITUNES,
          name: 'Test Episode 2',
          description: 'Test Episode Description 2',
          link: 'https://example.com/episode2',
          artwork: 'https://example.com/artwork2.jpg',
          fileExtention: 'mp3',
          durationMillis: 450000,
          releaseDate: new Date('2024-01-02'),
          vendorPodcast: {
            vendorId: undefined as unknown as string,
            vendor: VendorEnum.ITUNES,
            name: 'Test Podcast 2',
          },
        },
      ];

      mockVendor.searchEpisodes.mockResolvedValue(episodesWithoutPodcasts);
      podcastService.insertAndFetchBulkByVendor.mockResolvedValueOnce(
        mockStoredPodcasts,
      );
      podcastService.insertAndFetchBulkByVendor.mockResolvedValueOnce([]);

      await service.search(mockSearchQuery);

      const mockPodcastInsertAndFetchBulkByVendor = jest.spyOn(
        podcastService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockPodcastInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        [],
      );

      const mockEpisodeInsertAndFetchBulkByVendor = jest.spyOn(
        episodeService,
        'insertAndFetchBulkByVendor',
      );
      expect(mockEpisodeInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
        VendorEnum.ITUNES,
        episodesWithoutPodcasts.map((e) => ({
          ...e,
          podcastId: undefined,
        })),
      );
    });
    //   await service.search(mockSearchQuery);

    //   const mockArtistInsertAndFetchBulkByVendor = jest.spyOn(
    //     artistService,
    //     'insertAndFetchBulkByVendor',
    //   );
    //   expect(mockArtistInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
    //     VendorEnum.ITUNES,
    //     [
    //       {
    //         ...mockVendorPodcasts[0],
    //         artistId: 1, // artist1 maps to id 1
    //       },
    //       {
    //         ...mockVendorPodcasts[1],
    //         artistId: 2, // artist2 maps to id 2
    //       },
    //     ],
    //   );
    // });

    // it('should properly map podcast IDs to episodes', async () => {
    //   await service.search(mockSearchQuery);

    //   const mockPodcastInsertAndFetchBulkByVendor = jest.spyOn(
    //     podcastService,
    //     'insertAndFetchBulkByVendor',
    //   );
    //   expect(mockPodcastInsertAndFetchBulkByVendor).toHaveBeenCalledWith(
    //     VendorEnum.ITUNES,
    //     [
    //       {
    //         ...mockVendorEpisodes[0],
    //         podcastId: 1, // podcast1 maps to id 1
    //       },
    //       {
    //         ...mockVendorEpisodes[1],
    //         podcastId: 2, // podcast2 maps to id 2
    //       },
    //     ],
    //   );
    // });

    it('should return properly transformed response DTOs', async () => {
      const result = await service.search(mockSearchQuery);

      expect(result.podcasts).toBeDefined();
      expect(result.episodes).toBeDefined();
      expect(Array.isArray(result.podcasts)).toBe(true);
      expect(Array.isArray(result.episodes)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty search results', async () => {
      mockVendor.searchPodcasts.mockResolvedValue([]);
      mockVendor.searchEpisodes.mockResolvedValue([]);
      podcastService.search.mockResolvedValue([]);
      episodeService.search.mockResolvedValue([]);

      const result = await service.search({ term: 'nonexistent', limit: 10 });

      expect(result).toEqual({
        podcasts: [],
        episodes: [],
      });
    });

    it('should handle missing limit parameter', async () => {
      mockVendor.searchPodcasts.mockResolvedValue([]);
      mockVendor.searchEpisodes.mockResolvedValue([]);
      podcastService.search.mockResolvedValue([]);
      episodeService.search.mockResolvedValue([]);

      const result = await service.search({ term: 'test', limit: undefined });

      const mockPodcastSearch = jest.spyOn(podcastService, 'search');
      expect(mockPodcastSearch).toHaveBeenCalledWith('test', undefined);

      const mockEpisodeSearch = jest.spyOn(episodeService, 'search');
      expect(mockEpisodeSearch).toHaveBeenCalledWith('test', undefined);
      expect(result).toEqual({
        podcasts: [],
        episodes: [],
      });
    });
  });
});
