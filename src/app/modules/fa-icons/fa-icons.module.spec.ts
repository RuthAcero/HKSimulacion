import { FaIconsModule } from './fa-icons.module';

describe('FaIconsModule', () => {
  let faIconsModule: FaIconsModule;

  beforeEach(() => {
    faIconsModule = new FaIconsModule();
  });

  it('should create an instance', () => {
    expect(faIconsModule).toBeTruthy();
  });
});
