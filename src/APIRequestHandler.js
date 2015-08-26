import FED from './fed.js';
import APIRequest from './APIRequest.js';

const returnTrue = () => true;
const resolveIt = ( it ) => Promise.resolve( it );
const returnIt = ( it ) => it;
const throwIt = ( it ) => { throw it };

class APIRequestHandler
{
  constructor( { token = null, before = returnTrue, after = returnIt, filterRequest = resolveIt } = {} )
  {
    this.token   = token;
    this.before  = before;
    this.after   = after;
    this.filterRequest = filterRequest;
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

      const xhr = new XMLHttpRequest();

      if ( ! request.method || ! request.url ) {
        reject( new Error('Method and URL are required') );
        return;
      }

      xhr.withCredentials = true;

      xhr.onreadystatechange = () => {
        if ( xhr.readyState !== XMLHttpRequest.DONE ) {
          return;
        }

        let responseHeaders  = xhr.getAllResponseHeaders(),
            status = xhr.status,
            response = '';

        if ( responseHeaders ) {
          responseHeaders = this.parseHeaders( responseHeaders );
        }

        switch( xhr.getResponseHeader('Content-Type') ) {
          case 'application/json':
            response = JSON.parse( xhr.responseText );
            break;
          case 'text/xml':
            response = xhr.responseXML;
            break;
          case 'text/html':
            response = xhr.responseText;
            break;
          default:
            response = xhr.responseText;
        }

        resolve( {
          xhr,
          headers: responseHeaders,
          status,
          response
        } );
      };

      xhr.open( request.method, request.url );
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if ( request.headers ) {
        for ( let header in request.headers ) {
          xhr.setRequestHeader( header, request.headers[ header ] );
        }
      }

      xhr.send( request.data );
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
