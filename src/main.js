// import 'babelify/polyfill';
import FED from './fed.js';
import APIForm from './APIForm.js';
import APIRequest from './APIRequest.js';
import APIRequestHandler from './APIRequestHandler.js';

class AdminPanel extends FED.Controller
{
  constructor()
  {
    super();
  }
}

class HomeController extends FED.Controller
{
  constructor()
  {
    super();
  }

  run( { page = 'home' } = {} )
  {
    console.info( `You requested ${page}` );
  }
}

let App = null;

try {

  App = new FED.App(
    'API Test',
    '0.1.0',
    new FED.Router('/api-tester/')
  );

  App.router.add( new FED.Route('/:page?', new HomeController ) );
  // App.router.add( new FED.Route('/api-tester/admin/:panel/:name?/', function adminPanel( panel, name ) { console.log( panel, name ); } ) );

  App.init();

} catch ( error ) {

  console.error( error );

}


window.addEventListener('load', () => {

  Array.prototype.slice.call(
    document.querySelectorAll('.api-nav > a'),
    0
  ).forEach( ( anchor ) => {
    anchor.addEventListener('click', function( e ) {
      e.preventDefault();
      App.navigate( this.href, this.getAttribute('data-title') || this.textContent );
    });
  });

  const getTokenRequest = new APIRequest({
    method: 'POST',
    url: 'http://unexpected-drives.dev/api/v1/auth',
  }, ( handler, request ) => {

    let email = window.sessionStorage.getItem('email'),
        pass = window.sessionStorage.getItem('pass');

    while ( ! email ) {
      email = prompt('What is your email address?');
      window.sessionStorage.setItem('email', email );
    }

    while ( ! pass ) {
      pass = prompt('What is your password?');
      window.sessionStorage.setItem('pass', pass );
    }

    request.data = `email=${email}&password=${pass}`;
  });

  const getEntries = new APIRequest({
    method: 'GET',
    url: 'http://unexpected-drives.dev/api/v1/entry/'
  });

  const RequestHandler = new APIRequestHandler({

    filterRequest: ( handler, request ) => {
      if ( ! handler.token && request !== getTokenRequest ) {

        console.log( 'Token is missing. Lets try and fix that.' );

        return handler.send( getTokenRequest ).then( ( data ) => {

          if ( data.response.token ) {
            request.bearer( handler.token = data.response.token );
            return request;
          }

          throw new Error('Token not found');

        }, console.error.bind( console ) );

      }

      if ( handler.token ) {
        request.bearer( handler.token );
      }

      return Promise.resolve( request );
    },

    before: ( handler, request ) => {
      console.log( `Sending request to ${request.url}` );
    },

    after: ( handler, request, data ) => {
      // Grab the refresh token.
      if ( data.headers['authorization'] ) {
        console.log( handler.token.length, handler.token );
        handler.token = data.headers['authorization'].replace(/^bearer\s+/i, '');
        console.info( handler.token.length, handler.token );
      }

      return data;
    },

  });

  RequestHandler.send( getEntries ).then( console.log.bind( console ), console.error.bind( console ) );

//   const form = new APIForm(
//     document.querySelector('#api-form')
//   );

//   form.registerAction( 'Authenticate', authAction );

//   // form.submit();

}, false );
