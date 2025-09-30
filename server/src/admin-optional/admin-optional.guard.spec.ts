import { AdminOptionalGuard } from './admin-optional.guard';

describe('AdminOptionalGuard', () => {
  it('should be defined', () => {
    expect(new AdminOptionalGuard()).toBeDefined();
  });
});
