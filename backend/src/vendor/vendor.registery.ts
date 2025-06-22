import { Injectable } from '@nestjs/common';
import { ItunesVendor } from './itunes';
import { Vendor, VendorEnum } from './vendor.types';

@Injectable()
export class VendorRegistry {
  private readonly vendors: Record<VendorEnum, Vendor>;

  constructor(itunesVendor: ItunesVendor) {
    this.vendors = {
      [VendorEnum.ITUNES]: itunesVendor,
    };
  }

  get(vendor: VendorEnum): Vendor {
    const v = this.vendors[vendor];
    if (!v) throw new Error(`Vendor not registered: ${vendor}`);
    return v;
  }

  getAll(): Vendor[] {
    return Object.values(this.vendors);
  }
}
