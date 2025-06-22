import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { VendorEnum } from '../../vendor/vendor.types';

@Index('IDX_EPISODE_VENDOR_VENDORID', ['vendor', 'vendorId'], { unique: true })
@Entity()
export class Episode<T = unknown> {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: VendorEnum,
    default: VendorEnum.ITUNES,
  })
  vendor: VendorEnum;

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  durationMillis: number;

  @Column({ nullable: true })
  artwork: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  fileExtention: string;

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
  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  @JoinColumn({ name: 'podcastId' })
  podcast: Podcast;

  @Column({ nullable: true })
  podcastId?: number;
}
