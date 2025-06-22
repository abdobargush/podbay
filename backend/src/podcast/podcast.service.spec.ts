import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In, ObjectLiteral, ILike } from 'typeorm';
import { PodcastService } from './podcast.service';
import { Podcast } from './entities/podcast.entity';
import { VendorEnum } from '../vendor/vendor.types';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  jest.Mocked<Repository<T>>
>;

const createMockRepository = (): MockRepository<Podcast> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('PodcastService', () => {
  let service: PodcastService;
  let repo: MockRepository<Podcast>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PodcastService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<PodcastService>(PodcastService);
    repo = module.get<MockRepository<Podcast>>(getRepositoryToken(Podcast));
  });

  describe('firstOrCreateByVendorId', () => {
    it('should return existing podcast if found', async () => {
      const existingPodcast = {
        id: 1,
        vendorId: '123',
        vendor: VendorEnum.ITUNES,
      };
      repo.findOne!.mockResolvedValue(existingPodcast as any);

      const result = await service.firstOrCreateByVendorId(
        '123',
        VendorEnum.ITUNES,
        { name: 'Test' },
      );

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { vendorId: '123', vendor: VendorEnum.ITUNES },
      });
      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
      expect(result).toBe(existingPodcast);
    });

    it('should create and save a new podcast if not found', async () => {
      repo.findOne!.mockResolvedValue(undefined as any);
      const createdPodcast = {
        id: 2,
        vendorId: '456',
        vendor: VendorEnum.ITUNES,
        name: 'New Podcast',
      };
      repo.create!.mockReturnValue(createdPodcast as any);
      repo.save!.mockResolvedValue(createdPodcast as any);

      const result = await service.firstOrCreateByVendorId(
        '456',
        VendorEnum.ITUNES,
        { name: 'New Podcast' },
      );

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { vendorId: '456', vendor: VendorEnum.ITUNES },
      });
      expect(repo.create).toHaveBeenCalledWith({
        vendorId: '456',
        vendor: VendorEnum.ITUNES,
        name: 'New Podcast',
      });
      expect(repo.save).toHaveBeenCalledWith(createdPodcast);
      expect(result).toBe(createdPodcast);
    });
  });

  describe('insertAndFetchBulkByVendor', () => {
    it('should return empty array if payload is empty', async () => {
      const result = await service.insertAndFetchBulkByVendor(
        VendorEnum.ITUNES,
        [],
      );
      expect(result).toEqual([]);
    });

    it('should return empty array if no valid payload items (no vendorId)', async () => {
      const payload = [{ vendorId: null }, {}];
      const result = await service.insertAndFetchBulkByVendor(
        VendorEnum.ITUNES,
        payload as unknown as any,
      );
      expect(result).toEqual([]);
    });

    it('should insert valid payload and return fetched podcasts', async () => {
      const payload = [
        { vendorId: '1', name: 'Podcast 1' },
        { vendorId: '2', name: 'Podcast 2' },
      ];

      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const foundPodcastss = [
        { id: 1, vendorId: '1', name: 'Podcast 1', vendor: VendorEnum.ITUNES },
        { id: 2, vendorId: '2', name: 'Podcast 2', vendor: VendorEnum.ITUNES },
      ];

      jest
        .spyOn(repo, 'find')
        .mockResolvedValue(foundPodcastss as unknown as any);

      const result = await service.insertAndFetchBulkByVendor(
        VendorEnum.ITUNES,
        payload,
      );

      expect(queryBuilder.insert).toHaveBeenCalled();
      expect(queryBuilder.into).toHaveBeenCalledWith(Podcast);
      expect(queryBuilder.values).toHaveBeenCalledWith(payload as any);
      expect(queryBuilder.orIgnore).toHaveBeenCalled();
      expect(queryBuilder.execute).toHaveBeenCalled();

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          vendorId: In(payload.map((ep) => ep.vendorId)) as unknown as string,
          vendor: VendorEnum.ITUNES,
        },
      });

      expect(result).toEqual(foundPodcastss);
    });
  });

  // describe('findOrInsertBulkByVendor', () => {
  //   it('should return existing podcasts if all exist', async () => {
  //     const payload = [
  //       { vendorId: '1', name: 'P1' },
  //       { vendorId: '2', name: 'P2' },
  //     ];
  //     const existing = [
  //       { vendorId: '1', name: 'P1' },
  //       { vendorId: '2', name: 'P2' },
  //     ];

  //     repo.find!.mockResolvedValue(existing as any[]);
  //     // Since all exist, save should not be called, but just in case:
  //     repo.save!.mockResolvedValue([] as any); // return empty array, not single object

  //     const result = await service.findOrInsertBulkByVendor(
  //       VendorEnum.ITUNES,
  //       payload,
  //     );

  //     expect(repo.find).toHaveBeenCalledWith({
  //       where: {
  //         vendorId: In(['1', '2']),
  //         vendor: VendorEnum.ITUNES,
  //       },
  //     });
  //     expect(repo.save).not.toHaveBeenCalled();
  //     expect(result).toEqual(existing);
  //   });

  //   it('should save non-existing podcasts and return all', async () => {
  //     const payload = [
  //       { vendorId: '1', name: 'P1' },
  //       { vendorId: '2', name: 'P2' },
  //       { vendorId: '3', name: 'P3' },
  //     ];
  //     const existing = [{ vendorId: '1', name: 'P1' }];
  //     const newPodcasts = [
  //       { vendorId: '2', name: 'P2' },
  //       { vendorId: '3', name: 'P3' },
  //     ];

  //     repo.find!.mockResolvedValue(existing as any[]);
  //     repo.save!.mockResolvedValue(newPodcasts as any);

  //     const result = await service.findOrInsertBulkByVendor(
  //       VendorEnum.ITUNES,
  //       payload,
  //     );

  //     expect(repo.find).toHaveBeenCalledWith({
  //       where: {
  //         vendorId: In(['1', '2', '3']),
  //         vendor: VendorEnum.ITUNES,
  //       },
  //     });
  //     expect(repo.save).toHaveBeenCalledWith(newPodcasts);
  //     expect(result).toEqual([...existing, ...newPodcasts]);
  //   });
  // });

  describe('search', () => {
    it('should find podcasts by name with relations', async () => {
      const name = 'podcast';
      const foundPodcasts = [
        { id: 1, name: 'podcast1' },
        { id: 2, name: 'podcast2' },
      ];
      repo.find!.mockResolvedValue(foundPodcasts as any[]);

      const result = await service.search(name);

      expect(repo.find).toHaveBeenCalledWith({
        where: { name: ILike(`%${name}%`) },
        relations: { artist: true },
      });
      expect(result).toEqual(foundPodcasts);
    });
  });
});
