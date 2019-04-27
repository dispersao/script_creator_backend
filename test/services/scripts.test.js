const app = require('../../src/app');

describe('\'scripts\' service', () => {
  it('registered the service', () => {
    const service = app.service('scripts');
    expect(service).toBeTruthy();
  });
});
