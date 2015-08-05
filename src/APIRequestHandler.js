import FED from './fed.js';
import APIRequest from './APIRequest.js';

const returnTrue = () => true;
const resolveIt = ( it ) => Promise.resolve( it );
const returnIt = ( it ) => it;
const throwIt = ( it ) => { throw it };

class APIRequestHandler
{
  constructor( { token = null, before = returnTrue, after = returnIt, filterRequest = resolveIt, storage = window.sessionStorage } = {} )
  {
    this._token  = null;
    this.token   = window.sessionStorage.getItem( 'api_token' );
    this.storage = storage;
    this.before  = before;
    this.after   = after;
    this.filterRequest = filterRequest;
  }

  get token()
  {
    return this._token;
  }

  set token( value )
  {
    if ( this._token = value ) {
      if ( this.storage ) {
        this.storage.setItem( 'api_token', this._token );
        console.log('token saved to storage');
      }
    } else {
      if ( this.storage ) {
        this.storage.removeItem( 'api_token' );
        console.log('token removed from storage');
      }
    }
  }

  parseHeaders( headersString )
  {
    const headers = Object.create( null );

    headersString.split(/\r\n|\n|\r/).forEach( ( header ) => {
      if ( header ) {
        let [ key, value ] = header.trim().split(/:\s*/);
        headers[ key.toLowerCase().trim() ] = value.trim();
      }
    } );

    return headers;
  }

  sendRequest( request )
  {
    return new Promise( ( resolve, reject ) => {

      const req = new XMLHttpRequest();

      if ( ! request.method || ! request.url ) {
        reject( new Error('Method and URL are required') );
        return;
      }

      req.withCredentials = true;

      req.onreadystatechange = () => {
        if ( req.readyState !== XMLHttpRequest.DONE ) {
          return;
        }

        let responseHeaders  = req.getAllResponseHeaders(),
            status = req.status,
            response = '';

        if ( responseHeaders ) {
          responseHeaders = this.parseHeaders( responseHeaders );
        }

        switch( req.getResponseHeader('Content-Type') ) {
          case 'application/json':
            response = JSON.parse( req.responseText );
            break;
          case 'text/xml':
            response = req.responseXML;
            break;
          case 'text/html':
            response = req.responseText;
            break;
          default:
            response = req.responseText;
        }

        resolve( {
          ajax: req,
          headers: responseHeaders,
          status,
          response
        } );
      };

      req.open( request.method, request.url );
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      if ( request.headers ) {
        for ( let header in request.headers ) {
          req.setRequestHeader( header, request.headers[ header ] );
        }
      }

      req.send( request.data );
    });
  }

  send( /* APIRequest */ request )
  {
    if ( this.before( this, request ) === false ) {
      return Promise.reject(
        new Error('Send aborted by before()')
      );
    }

    if ( request.before && request.before( this, request ) === false ) {
      return Promise.reject(
        new Error('Send aborted by request.before()')
      );
    }

    return this.filterRequest( this, request )
      .then( this.sendRequest.bind( this ) )
      .then(
        ( data ) => {
          return this.after( this, request, data );
        },
        throwIt
      );
  }

}

export default APIRequestHandler;
