import { ScanRoutingModule } from './scan-routing.module';

describe('ScanRoutingModule', () => {
  let scanRoutingModule: ScanRoutingModule;

  beforeEach(() => {
    scanRoutingModule = new ScanRoutingModule();
  });

  it('should create an instance', () => {
    expect(scanRoutingModule).toBeTruthy();
  });
});
