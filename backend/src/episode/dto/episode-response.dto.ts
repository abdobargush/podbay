import { Exclude, Expose, Type } from 'class-transformer';
import { Episode } from '../entities/episode.entity';
import { PodcastResponseDto } from '../../podcast/dto/podcast-response.dto';
import { Podcast } from '../../podcast/entities/podcast.entity';

export class EpisodeResponseDto extends Episode {
  @Exclude()
  declare podcastId?: any;

  @Expose()
  @Type(() => PodcastResponseDto)
  declare podcast: Podcast;

  @Exclude()
  declare vendor: any;

  @Exclude()
  declare vendorId: any;

  @Exclude()
  declare vendorMetadata?: any;
}
