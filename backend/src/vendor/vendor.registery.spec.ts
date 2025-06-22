import { VendorRegistry } from './vendor.registery';
import { VendorEnum, Vendor } from './vendor.types';
import { ItunesVendor } from './itunes';

describe('VendorRegistry', () => {
  let itunesVendor: Vendor;
  let registry: VendorRegistry;

  beforeEach(() => {
    // Create a minimal mock ItunesVendor implementing Vendor interface
    itunesVendor = {
      name: VendorEnum.ITUNES,
      url: 'https://itunes.apple.com/search',
      searchPodcasts: jest.fn(),
      searchEpisodes: jest.fn(),
    };

    registry = new VendorRegistry(itunesVendor as ItunesVendor);
  });

  it('should return the registered vendor for ITUNES', () => {
    const vendor = registry.get(VendorEnum.ITUNES);
    expect(vendor).toBe(itunesVendor);
  });

  it('should throw error if vendor not registered', () => {
    expect(() => registry.get('UNKNOWN' as VendorEnum)).toThrowError(
      'Vendor not registered: UNKNOWN',
    );
  });

  it('should return all registered vendors', () => {
    const vendors = registry.getAll();
    expect(vendors).toContain(itunesVendor);
    expect(vendors.length).toBe(1);
  });
});
