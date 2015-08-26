import FED from './fed.js';

const noop = () => {};

class APIRequest extends FED.Model
{
  constructor( attributes = {}, before = noop )
  {
    super( {
      fields: {
        method: 'string',
        url: 'string',
        data: 'object',
        headers: 'object'
      },
      attributes
    } );

    this.data = new FormData();
    this.headers = Object.create( null );

    if ( this.method.toUpperCase() === 'PUT' ) {
      this.method = 'POST';
      this.data.set('_method', 'PUT');
    }

    this.before = before;
  }

  header( key, value )
  {
    this.headers[ key.trim() ] = value.trim();
    return this;
  }

  bearer( token )
  {
    return this.header('Authorization', `Bearer ${token}`);
  }

  setData( data = {} )
  {
    for ( let key in data ) {
      this.data.set( key, data[ key ] );
    }
  }
}

export default APIRequest;
