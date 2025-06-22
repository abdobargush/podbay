import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { VendorEnum } from '../../vendor/vendor.types';

@Index('IDX_ARTIST_VENDOR_VENDORID', ['vendor', 'vendorId'], { unique: true })
@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column({ nullable: true })
  link?: string;

  @Column({
    type: 'enum',
    enum: VendorEnum,
    default: VendorEnum.ITUNES,
  })
  vendor: VendorEnum;

  @Column()
  vendorId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Podcast, (podcast) => podcast.artist)
  podcasts: Podcast[];
}
