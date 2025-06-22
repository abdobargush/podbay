import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { VendorEnum } from '../vendor/vendor.types';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
  ) {}

  async firstOrCreateByVendorId(
    vendorId: string | number,
    vendor: VendorEnum,
    payload: Partial<Artist>,
  ): Promise<Artist> {
    const vendorIdStr = vendorId.toString();

    let artist = await this.artistRepo.findOne({
      where: {
        vendorId: vendorIdStr,
        vendor,
      },
    });

    if (!artist) {
      artist = this.artistRepo.create({
        vendorId: vendorIdStr,
        vendor,
        ...payload,
      });
      artist = await this.artistRepo.save(artist);
    }

    return artist;
  }

  async insertAndFetchBulkByVendor(
    vendor: VendorEnum,
    payload: Partial<Artist>[],
  ): Promise<Artist[]> {
    if (!payload.length) return [];

    const validPayload = payload.filter((item) => item.vendorId != null);
    if (!validPayload.length) return [];

    // Insert ignoring duplicates
    await this.artistRepo
      .createQueryBuilder()
      .insert()
      .into(Artist)
      .values(validPayload as Omit<Artist, 'podcasts'>[])
      .orIgnore()
      .execute();

    // Fetch all artists match vendor and vendorIds
    const vendorIds = payload.map((p) => p.vendorId);
    const allArtists = await this.artistRepo.find({
      where: {
        vendor,
        vendorId: In(vendorIds),
      },
    });

    return allArtists;
  }

  /**
   * This method is temporarily disabled
   * because it fails when duplicates exist in the database,
   * particularly due to parallel insertions causing conflicts.
   */
  // async findOrInsertBulkByVendor(
  //   vendor: VendorEnum,
  //   payload: Partial<Artist>[],
  // ): Promise<Artist[]> {
  //   // Find already existing artists
  //   const existingArtists = await this.artistRepo.find({
  //     where: {
  //       vendorId: In(payload.map((artist) => artist.vendorId)),
  //       vendor,
  //     },
  //   });

  //   // Create non existing artists
  //   const existingIds = new Set(existingArtists.map((p) => p.vendorId));
  //   const nonExistingArtists = payload.filter(
  //     (p) => p.vendorId && !existingIds.has(p.vendorId),
  //   );
  //   const createdArtists = await this.artistRepo.save(nonExistingArtists);

  //   // Return the combined array
  //   return [...existingArtists, ...createdArtists];
  // }

  async search(name: string) {
    const artists = await this.artistRepo.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return artists;
  }
}
