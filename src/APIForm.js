import FED from './fed.js';

class APIForm extends FED.Controller
{
  constructor( form )
  {
    super();

    this.form   = form;
    this.method = this.form.querySelector('.api-method');
    this.url    = this.form.querySelector('.api-url');
    this.data   = this.form.querySelectorAll('.api-data');
    this.button = this.form.querySelector('.api-submit');
    this.data   = this.form.querySelector('.api-data');

    this.headers = Object.create( null );

    this.apiActions = Object.create( null );

    this.authHeader = this.form.querySelector('.api-authorization');

    this.errorsOutput   = this.form.querySelector('.api-output--errors');
    this.headersOutput  = this.form.querySelector('.api-output--headers');
    this.responseOutput = this.form.querySelector('.api-output--response');

    this.token = null;

    this.form.addEventListener( 'submit', this, false );
  }

  submit()
  {
    this.button.click();
  }

  clearOutput()
  {
    this.errorsOutput.innerHTML = this.headersOutput.innerHTML = this.responseOutput.innerHTML = '';
  }

  handleEvent( e )
  {
    e.preventDefault();

    const render = this.renderData.bind( this );

    const renderError = ( error ) => {
      this.errorsOutput.innerHTML = this.toHTML( error );
    }

    this.submitForm().then( render, renderError );
  }

  renderData( data )
  {
    console.log( data );
    this.headersOutput.innerHTML = this.toHTML( data.headers );
    this.responseOutput.innerHTML = this.prettyJSON( data.response );
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

  parseData()
  {
    const data = this.data.value.trim();

    // const formData = new FormData();

    return data === '' ? null : data;
  }

  loadAction( /* APIAction */ action )
  {
    this.method.value = action.method;
    this.url.value = action.url;
    this.data.value = action.data;
    this.headers = action.headers;
    return this;
  }

  registerAction( key, /* APIAction */ action )
  {
    this.apiActions[ key ] = action;
  }

  submitForm()
  {
    const url = this.url.value.trim(),
          method = this.method.value.trim(),
          data   = this.parseData(),
          headers = this.headers;

    console.log('Submitting form');

    if ( this.authHeader && this.authHeader.value ) {
      headers['Authorization'] = this.authHeader.value.trim();
    }

    return this.sendRequest( { url, method, headers, data } );
  }

  sendRequest( { url, method = 'GET', headers = {}, data = null } )
  {
    console.log( `Sending request to ${url}` );

    return new Promise( ( resolve, reject ) => {

      const req = new XMLHttpRequest();

      if ( ! method || ! url ) {
        reject( new Error('Method and URL are required') );
        console.log('Request rejected');
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
            response = `<xmp>${req.responseText}</xmp>`;
            break;
          default:
            response = req.responseText;
        }

        resolve( {
          headers: responseHeaders,
          status,
          response
        } );

        console.log('Request resolved');
      };

      req.open( method, url );
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      for ( let header in headers ) {
        req.setRequestHeader( header, headers[ header ] );
      }

      req.send( data );

      console.log('Request sent');
    });
  }

  getType( data )
  {
    const [ , dataType ] = Object.prototype.toString.call( data ).match( /\s(\w+)\]$/ );
    return dataType.toLowerCase();
  }

  prettyJSON( data )
  {
    return JSON.stringify( data, null, 4 );
  }

  toHTML( data )
  {
    let html = '';

    const dataType = this.getType( data );

    switch( dataType ) {
      case 'object':
      case 'array':

        for ( let d in data ) {
          let dataHTML = this.toHTML( data[ d ] );
          html += `<tr><th scope="row">${d}</th><td>${dataHTML}</td></tr>`;
        }

        html = `<table data-type="${dataType}">${html}</table>`;

        break;
      default:
        html = `<span data-type="${dataType}">${data}</span>`;
    }

    return html;
  }
}

export default APIForm;
