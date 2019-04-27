const app = require('../../src/app');

describe('\'script_sequences\' service', () => {
  it('registered the service', () => {
    const service = app.service('script-sequences');
    expect(service).toBeTruthy();
  });
});
