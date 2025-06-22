import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItunesVendor } from './itunes';
import { VendorRegistry } from './vendor.registery';

@Module({
  imports: [ConfigModule],
  providers: [ItunesVendor, VendorRegistry],
  exports: [VendorRegistry],
})
export class VendorModule {}
