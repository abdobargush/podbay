import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { VendorEnum } from '../vendor/vendor.types';
import { Episode } from './entities/episode.entity';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private episodeRepo: Repository<Episode>,
  ) {}

  async firstOrCreateByVendorId(
    vendorId: string | number,
    vendor: VendorEnum,
    payload: Partial<Episode>,
  ): Promise<Episode> {
    const vendorIdStr = vendorId.toString();

    let episode = await this.episodeRepo.findOne({
      where: {
        vendorId: vendorIdStr,
        vendor,
      },
    });

    if (!episode) {
      episode = this.episodeRepo.create({
        vendorId: vendorIdStr,
        vendor,
        ...payload,
      });
      episode = await this.episodeRepo.save(episode);
    }

    return episode;
  }

  async insertAndFetchBulkByVendor(
    vendor: VendorEnum,
    payload: Partial<Episode>[],
  ): Promise<Episode[]> {
    if (payload.length === 0) return [];

    const validPayload = payload.filter((item) => item.vendorId != null);
    if (!validPayload.length) return [];

    // Insert while ignoring duplicates
    await this.episodeRepo
      .createQueryBuilder()
      .insert()
      .into(Episode)
      .values(validPayload as Omit<Episode, 'podcast' | 'vendorMetadata'>[])
      .orIgnore()
      .execute();

    // Fetch all episodes match vendor and vendorIds
    const allEpisodes = await this.episodeRepo.find({
      where: {
        vendorId: In(payload.map((ep) => ep.vendorId)),
        vendor,
      },
    });

    return allEpisodes;
  }

  /**
   * This method is temporarily disabled
   * because it fails when duplicates exist in the database,
   * particularly due to parallel insertions causing conflicts.
   */
  // async findOrInsertBulkByVendor(
  //   vendor: VendorEnum,
  //   payload: Partial<Episode>[],
  // ): Promise<Episode[]> {
  //   // Find already existing episodes
  //   const existingEpisodes = await this.episodeRepo.find({
  //     where: {
  //       vendorId: In(payload.map((episode) => episode.vendorId)),
  //       vendor,
  //     },
  //   });

  //   // Create non existing episodes
  //   const existingIds = new Set(existingEpisodes.map((p) => p.vendorId));
  //   const nonExistingEpisodes = payload.filter(
  //     (p) => p.vendorId && !existingIds.has(p.vendorId),
  //   );
  //   const createdEpisodes = await this.episodeRepo.save(nonExistingEpisodes);

  //   // Return the combined array
  //   return [...existingEpisodes, ...createdEpisodes];
  // }

  async search(name: string, limit?: number): Promise<Episode[]> {
    const episode = await this.episodeRepo.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: { podcast: true },
      take: limit,
    });

    return episode;
  }
}
