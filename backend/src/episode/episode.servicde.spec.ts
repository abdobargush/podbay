import { Test, TestingModule } from '@nestjs/testing';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { EpisodeService } from './episode.service';
import { Episode } from './entities/episode.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendorEnum } from '../vendor/vendor.types';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  jest.Mocked<Repository<T>>
>;

const createMockRepository = (): MockRepository<Episode> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('EpisodeService', () => {
  let service: EpisodeService;
  let repo: MockRepository<Episode>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodeService,
        {
          provide: getRepositoryToken(Episode),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<EpisodeService>(EpisodeService);
    repo = module.get<MockRepository<Episode>>(getRepositoryToken(Episode));
  });

  describe('firstOrCreateByVendorId', () => {
    it('should return existing episode if found', async () => {
      const existingEpisode = {
        id: 1,
        vendorId: '123',
        vendor: VendorEnum.ITUNES,
      };
      repo.findOne!.mockResolvedValue(existingEpisode as unknown as any);

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
      expect(result).toEqual(existingEpisode);
    });

    it('should create and save episode if not found', async () => {
      repo.findOne!.mockResolvedValue(null);
      const createdEpisode = {
        id: 2,
        vendorId: '456',
        vendor: VendorEnum.ITUNES,
        name: 'New Episode',
      };
      repo.create!.mockReturnValue(createdEpisode as unknown as any);
      repo.save!.mockResolvedValue(createdEpisode as unknown as any);

      const result = await service.firstOrCreateByVendorId(
        '456',
        VendorEnum.ITUNES,
        { name: 'New Episode' },
      );

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { vendorId: '456', vendor: VendorEnum.ITUNES },
      });
      expect(repo.create).toHaveBeenCalledWith({
        vendorId: '456',
        vendor: VendorEnum.ITUNES,
        name: 'New Episode',
      });
      expect(repo.save).toHaveBeenCalledWith(createdEpisode);
      expect(result).toEqual(createdEpisode);
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

    it('should insert valid payload and return fetched episodes', async () => {
      const payload = [
        { vendorId: '1', name: 'Episode 1' },
        { vendorId: '2', name: 'Episode 2' },
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

      const foundEpisodes = [
        { id: 1, vendorId: '1', name: 'Episode 1', vendor: VendorEnum.ITUNES },
        { id: 2, vendorId: '2', name: 'Episode 2', vendor: VendorEnum.ITUNES },
      ];

      jest
        .spyOn(repo, 'find')
        .mockResolvedValue(foundEpisodes as unknown as any);

      const result = await service.insertAndFetchBulkByVendor(
        VendorEnum.ITUNES,
        payload,
      );

      expect(queryBuilder.insert).toHaveBeenCalled();
      expect(queryBuilder.into).toHaveBeenCalledWith(Episode);
      expect(queryBuilder.values).toHaveBeenCalledWith(
        payload as any, // casting because your method expects Omit<Episode, ...>
      );
      expect(queryBuilder.orIgnore).toHaveBeenCalled();
      expect(queryBuilder.execute).toHaveBeenCalled();

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          vendorId: In(payload.map((ep) => ep.vendorId)) as unknown as string,
          vendor: VendorEnum.ITUNES,
        },
      });

      expect(result).toEqual(foundEpisodes);
    });
  });

  // describe('findOrInsertBulkByVendor', () => {
  //   it('should save and return combined episodes if some missing', async () => {
  //     const payload = [
  //       { vendorId: '1', name: 'E1' },
  //       { vendorId: '2', name: 'E2' },
  //       { vendorId: '3', name: 'E3' },
  //     ];
  //     const existing = [
  //       { id: 1, vendorId: '1', vendor: VendorEnum.ITUNES, name: 'E1' },
  //     ];
  //     const toCreate = [
  //       { vendorId: '2', name: 'E2' },
  //       { vendorId: '3', name: 'E3' },
  //     ];
  //     const created = [
  //       { id: 2, vendorId: '2', vendor: VendorEnum.ITUNES, name: 'E2' },
  //       { id: 3, vendorId: '3', vendor: VendorEnum.ITUNES, name: 'E3' },
  //     ];

  //     repo.find!.mockResolvedValue(existing as any);
  //     repo.save!.mockResolvedValue(created as any);

  //     const result = await service.findOrInsertBulkByVendor(
  //       VendorEnum.ITUNES,
  //       payload,
  //     );

  //     expect(repo.find).toHaveBeenCalledWith({
  //       where: {
  //         vendorId: expect.anything() as unknown as string,
  //         vendor: VendorEnum.ITUNES,
  //       },
  //     });
  //     expect(repo.save).toHaveBeenCalledWith(toCreate);
  //     expect(result).toEqual([...existing, ...created]);
  //   });
  // });

  describe('search', () => {
    it('should search episodes by name with relations', async () => {
      const episodes = [
        {
          id: 1,
          name: 'Test Episode',
          podcast: { id: 1, name: 'Test Podcast' },
        },
      ];
      repo.find!.mockResolvedValue(episodes as any);

      const result = await service.search('Test');

      expect(repo.find).toHaveBeenCalledWith({
        where: { name: expect.anything() as unknown as string },
        relations: { podcast: true },
      });
      expect(result).toEqual(episodes);
    });
  });
});
