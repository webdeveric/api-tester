import APIRequest from './APIRequest.js';
import APIRequestHandler from './APIRequestHandler.js';

class APIForm
{
  constructor( form, handler )
  {
    this.form   = form;
    this.method = this.form.querySelector('.api-method');
    this.url    = this.form.querySelector('.api-url');
    this.button = this.form.querySelector('.api-submit');
    this.data   = this.form.querySelector('.api-data');
    this.photo  = this.form.querySelector('.api-photo');

    this.errorsOutput   = this.form.querySelector('.api-output--errors');
    this.headersOutput  = this.form.querySelector('.api-output--headers');
    this.responseOutput = this.form.querySelector('.api-output--response');

    this.handler = handler;

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

    console.log('handleEvent called');

    const request = new APIRequest({
      method: this.method.value.trim(),
      url: this.url.value.trim(),
    });

    request.setData( this.parseData( this.data.value ) );

    if ( this.photo && this.photo.files[0] ) {
      request.data.set("photo", this.photo.files[0] );
    }

    const render = this.renderData.bind( this );

    const renderError = ( error ) => {
      this.errorsOutput.innerHTML = this.toHTML( error );
    }

    this.handler.send( request ).then( render, renderError );
  }

  renderData( data )
  {
    // console.log( data );
    this.headersOutput.innerHTML = this.toHTML( data.headers );
    this.responseOutput.innerHTML = this.prettyJSON( data.response );
  }

  parseData( data )
  {
    const parsed = Object.create( null );
    const parts = data.trim().split("&").map( d => d.split('=') );

    parts.forEach( ( part ) => {
      const [ key, value ] = part;
      if ( key && value ) {
        parsed[ key ] = value;
      }
    });

    return parsed;
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
