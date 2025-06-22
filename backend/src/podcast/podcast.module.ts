import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcast.entity';
import { PodcastService } from './podcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast])],
  providers: [PodcastService],
  exports: [TypeOrmModule, PodcastService],
})
export class PodcastModule {}
