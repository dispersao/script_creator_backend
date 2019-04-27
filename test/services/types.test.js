const app = require('../../src/app');

describe('\'Types\' service', () => {
  it('registered the service', () => {
    const service = app.service('types');
    expect(service).toBeTruthy();
  });
});
