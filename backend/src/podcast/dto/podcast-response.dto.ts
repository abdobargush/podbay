import { Exclude, Expose, Type } from 'class-transformer';
import { Podcast } from '../entities/podcast.entity';
import { ArtistResponseDto } from '../../artist/dto/artist-response.dto';
import { Artist } from '../../artist/entities/artist.entity';

export class PodcastResponseDto extends Podcast {
  @Exclude()
  declare artistId?: any;

  @Expose()
  @Type(() => ArtistResponseDto)
  declare artist: Artist;

  @Exclude()
  declare vendor: any;

  @Exclude()
  declare vendorId: any;

  @Exclude()
  declare vendorMetadata?: any;
}
