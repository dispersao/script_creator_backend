const app = require('../../src/app');

describe('\'sequences\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/sequences');
    expect(service).toBeTruthy();
  });
});
