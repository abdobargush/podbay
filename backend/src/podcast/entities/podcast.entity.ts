import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Episode } from '../../episode/entities/episode.entity';
import { VendorEnum } from '../../vendor/vendor.types';

@Index('IDX_PODCAST_VENDOR_VENDORID', ['vendor', 'vendorId'], { unique: true })
@Entity()
export class Podcast<T = unknown> {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  feedUrl?: string;

  @Column({ nullable: true })
  artwork?: string;

  @Column({
    type: 'enum',
    enum: VendorEnum,
    default: VendorEnum.ITUNES,
  })
  vendor: VendorEnum;

  @Column()
  vendorId: string;

  @Column({ type: 'json', nullable: true })
  vendorMetadata?: T;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Artist, (artist) => artist.podcasts)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  artistId?: number;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  episodes: Episode[];
}
