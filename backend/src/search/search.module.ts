import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { VendorModule } from 'src/vendor/vendor.module';
import { ArtistModule } from 'src/artist/artist.module';
import { PodcastModule } from 'src/podcast/podcast.module';
import { EpisodeModule } from 'src/episode/episode.module';

@Module({
  imports: [VendorModule, ArtistModule, PodcastModule, EpisodeModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
