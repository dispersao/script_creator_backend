import Feathers from '@feathersjs/feathers';
import Rest from '@feathersjs/rest-client';
import Authentication from '@feathersjs/authentication-client'

const app = Feathers();

// Connect to the same as the browser URL (only in the browser)
const restClient = Rest();

// Configure an AJAX library (see below) with that client
app.configure(restClient.fetch(window.fetch));
app.configure(Authentication({storage: localStorage}));

// Connect to the `http://feathers-api.com/messages` service
const scriptsService = app.service('scripts');
const sequenceSservice = app.service('sequences');
const passportValidation = app.passport.verifyJWT;
const getUser = () => app.get('user')

const authenticate = (userData) => {

  const data = userData ? {
    ...userData,
    strategy: 'local'
  } : undefined

  return app.authenticate(data)
  .then(response => {
    return app.passport.verifyJWT(response.accessToken);
  })
  .then(payload => {
    return app.service('users').get(payload.userId);
  })
  .then(user => {
    app.set('user', user);
    return user;
  })
}

export {getUser, scriptsService, sequenceSservice, authenticate, passportValidation};
