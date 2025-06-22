import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { Artist } from './entities/artist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, ObjectLiteral, Repository } from 'typeorm';
import { VendorEnum } from '../vendor/vendor.types';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  jest.Mocked<Repository<T>>
>;

const createMockRepo = (): MockRepository<Artist> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ArtistService', () => {
  let service: ArtistService;
  let repo: MockRepository<Artist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: getRepositoryToken(Artist),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    repo = module.get<MockRepository<Artist>>(getRepositoryToken(Artist))!;
  });

  describe('firstOrCreateByVendorId', () => {
    it('should return existing artist if found', async () => {
      const mockArtist = {
        id: 1,
        name: 'Existing',
        vendorId: '123',
        vendor: VendorEnum.ITUNES,
      } as Artist;

      repo.findOne!.mockResolvedValue(mockArtist);

      const result = await service.firstOrCreateByVendorId(
        '123',
        VendorEnum.ITUNES,
        {},
      );
      expect(result).toEqual(mockArtist);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { vendorId: '123', vendor: VendorEnum.ITUNES },
      });
    });

    it('should create and return artist if not found', async () => {
      const payload = { name: 'New Artist', vendorId: '999' };
      const createdArtist = {
        id: 2,
        vendor: VendorEnum.ITUNES,
        ...payload,
      } as Artist;

      repo.findOne!.mockResolvedValue(null);
      repo.create!.mockReturnValue(createdArtist);
      repo.save!.mockResolvedValue(createdArtist);

      const result = await service.firstOrCreateByVendorId(
        '999',
        VendorEnum.ITUNES,
        payload,
      );
      expect(repo.create).toHaveBeenCalledWith({
        vendor: VendorEnum.ITUNES,
        ...payload,
      });
      expect(repo.save).toHaveBeenCalledWith(createdArtist);
      expect(result).toEqual(createdArtist);
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
        payload as any,
      );
      expect(result).toEqual([]);
    });

    it('should insert valid payload and return fetched artists', async () => {
      const payload = [
        { vendorId: '1', name: 'Artist 1' },
        { vendorId: '2', name: 'Artist 2' },
      ];

      const queryBuilder = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };

      (repo.createQueryBuilder as jest.Mock).mockReturnValue(queryBuilder);

      const foundArtists = [
        { id: 1, vendorId: '1', name: 'Artist 1', vendor: VendorEnum.ITUNES },
        { id: 2, vendorId: '2', name: 'Artist 2', vendor: VendorEnum.ITUNES },
      ];

      repo.find!.mockResolvedValue(foundArtists as any);

      const result = await service.insertAndFetchBulkByVendor(
        VendorEnum.ITUNES,
        payload,
      );

      expect(queryBuilder.insert).toHaveBeenCalled();
      expect(queryBuilder.into).toHaveBeenCalledWith(Artist);
      expect(queryBuilder.values).toHaveBeenCalledWith(
        payload as any, // casting still required if strict
      );
      expect(queryBuilder.orIgnore).toHaveBeenCalled();
      expect(queryBuilder.execute).toHaveBeenCalled();

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          vendorId: In(payload.map((ep) => ep.vendorId)) as unknown as string,
          vendor: VendorEnum.ITUNES,
        },
      });

      expect(result).toEqual(foundArtists);
    });
  });

  // describe('findOrInsertBulkByVendor', () => {
  //   it('should insert only non-existing artists', async () => {
  //     const input = [
  //       { vendorId: '1', name: 'A' },
  //       { vendorId: '2', name: 'B' },
  //       { vendorId: '3', name: 'C' },
  //     ];
  //     const existing = [
  //       {
  //         vendorId: '2',
  //         name: 'B',
  //         id: 22,
  //         vendor: VendorEnum.ITUNES,
  //       } as Artist,
  //     ];
  //     const created = [
  //       {
  //         vendorId: '1',
  //         name: 'A',
  //         id: 11,
  //         vendor: VendorEnum.ITUNES,
  //       } as Artist,
  //       {
  //         vendorId: '3',
  //         name: 'C',
  //         id: 33,
  //         vendor: VendorEnum.ITUNES,
  //       } as Artist,
  //     ];

  //     repo.find!.mockResolvedValue(existing);
  //     repo.save!.mockResolvedValue(created as any);

  //     const result = await service.findOrInsertBulkByVendor(
  //       VendorEnum.ITUNES,
  //       input,
  //     );
  //     expect(result).toEqual([...existing, ...created]);
  //   });
  // });

  describe('search', () => {
    it('should return artists matching name', async () => {
      const found = [
        { id: 1, name: 'Joe Rogan' },
        { id: 2, name: 'Joey Diaz' },
      ] as Artist[];

      repo.find!.mockResolvedValue(found);

      const result = await service.search('Joe');
      expect(repo.find).toHaveBeenCalledWith({
        where: { name: expect.anything() as unknown as string },
      });
      expect(result).toEqual(found);
    });
  });
});
