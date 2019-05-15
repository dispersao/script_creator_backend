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
const authentication = app.authenticate;
const passportValidation = app.passport.verifyJWT;
const getUser = () => app.get('user')

const authenticate = (data) => {

  return app.authenticate(data)
  .then(response => {
    console.log('Authenticated!', response);
    return app.passport.verifyJWT(response.accessToken);
  })
  .then(payload => {
    console.log('JWT Payload', payload);
    return app.service('users').get(payload.userId);
  })
  .then(user => {
    app.set('user', user);
    console.log('User', app.get('user'));
    return user;
  })
}

export {getUser, scriptsService, sequenceSservice, authenticate, passportValidation};
