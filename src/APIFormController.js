import FED from './fed.js';
import APIForm from './APIForm.js';
import APIRequest from './APIRequest.js';
import APIRequestHandler from './APIRequestHandler.js';

class APIFormController extends FED.Controller
{
  constructor()
  {
    super();

    this.view = new FED.View('/views/api-form.html');

    this.form = null;

    this.getTokenRequest = new APIRequest({
      method: 'POST',
      url: 'https://unexpected-drives.dev/api/v1/auth',
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

    this.requestHandler = new APIRequestHandler({
      token: window.sessionStorage.getItem('api-token'),

      filterRequest: ( handler, request ) => {

        if ( ! handler.token && request !== this.getTokenRequest ) {

          console.log( 'Token is missing. Lets try and fix that.' );

          return handler.send( this.getTokenRequest ).then( ( data ) => {

            if ( data.response.token ) {
              window.sessionStorage.setItem('api-token', handler.token = data.response.token );
              request.bearer( handler.token );
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
          handler.token = data.headers['authorization'].replace(/^bearer\s+/i, '');
        }

        return data;
      },

    });
  }

  run()
  {
    this.view.set('heading', 'API Tester').renderInto('#content').then( ( element ) => {
      this.form = new APIForm( element.querySelector('form'), this.requestHandler );
    } );
  }
}

export default APIFormController;
