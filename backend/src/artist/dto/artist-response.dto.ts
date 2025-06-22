import { Exclude } from 'class-transformer';
import { Artist } from '../entities/artist.entity';

export class ArtistResponseDto extends Artist {
  @Exclude()
  declare vendor: any;

  @Exclude()
  declare vendorId: any;
}
