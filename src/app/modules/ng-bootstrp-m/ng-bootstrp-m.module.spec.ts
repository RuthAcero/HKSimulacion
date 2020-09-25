import { NgBootstrpMModule } from './ng-bootstrp-m.module';

describe('NgBootstrpMModule', () => {
  let ngBootstrpMModule: NgBootstrpMModule;

  beforeEach(() => {
    ngBootstrpMModule = new NgBootstrpMModule();
  });

  it('should create an instance', () => {
    expect(ngBootstrpMModule).toBeTruthy();
  });
});
