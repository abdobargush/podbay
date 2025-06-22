import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { VendorEnum } from '../vendor/vendor.types';
import { Podcast } from './entities/podcast.entity';

@Injectable()
export class PodcastService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepo: Repository<Podcast>,
  ) {}

  async firstOrCreateByVendorId(
    vendorId: string | number,
    vendor: VendorEnum,
    payload: Partial<Podcast>,
  ): Promise<Podcast> {
    const vendorIdStr = vendorId.toString();

    let podcast = await this.podcastRepo.findOne({
      where: {
        vendorId: vendorIdStr,
        vendor,
      },
    });

    if (!podcast) {
      podcast = this.podcastRepo.create({
        vendorId: vendorIdStr,
        vendor,
        ...payload,
      });
      podcast = await this.podcastRepo.save(podcast);
    }

    return podcast;
  }

  async insertAndFetchBulkByVendor(
    vendor: VendorEnum,
    payload: Partial<Podcast>[],
  ): Promise<Podcast[]> {
    if (payload.length === 0) return [];

    const validPayload = payload.filter((item) => item.vendorId != null);
    if (!validPayload.length) return [];

    // Insert while ignoring duplicates
    await this.podcastRepo
      .createQueryBuilder()
      .insert()
      .into(Podcast)
      .values(
        validPayload as Omit<
          Podcast,
          'episodes' | 'artist' | 'vendorMetadata'
        >[],
      )
      .orIgnore()
      .execute();

    // Fetch all podcasts match vendor and vendorIds
    const allPodcasts = await this.podcastRepo.find({
      where: {
        vendorId: In(payload.map((podcast) => podcast.vendorId)),
        vendor,
      },
    });

    return allPodcasts;
  }

  /**
   * This method is temporarily disabled
   * because it fails when duplicates exist in the database,
   * particularly due to parallel insertions causing conflicts.
   */
  // async findOrInsertBulkByVendor(
  //   vendor: VendorEnum,
  //   payload: Partial<Podcast>[],
  // ): Promise<Podcast[]> {
  //   if (payload.length === 0) return [];

  //   // Find already existing podcasts
  //   const existingPodcasts = await this.podcastRepo.find({
  //     where: {
  //       vendorId: In(payload.map((podcast) => podcast.vendorId)),
  //       vendor,
  //     },
  //   });

  //   if (payload.length === existingPodcasts.length) return existingPodcasts;

  //   // Create non existing podcasts
  //   const existingIds = new Set(existingPodcasts.map((p) => p.vendorId));
  //   const nonExistingPodcasts = payload.filter(
  //     (p) => p.vendorId && !existingIds.has(p.vendorId),
  //   );
  //   const createdPodcasts = await this.podcastRepo.save(nonExistingPodcasts);

  //   // Return the combined array
  //   return [...existingPodcasts, ...createdPodcasts];
  // }

  async search(name: string, limit?: number): Promise<Podcast[]> {
    const podcasts = await this.podcastRepo.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: { artist: true },
      take: limit,
    });

    return podcasts;
  }
}
