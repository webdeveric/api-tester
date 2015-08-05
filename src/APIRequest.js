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
        data: 'string',
        headers: 'object'
      },
      attributes
    } );

    this.before = before;
  }

  header( key, value )
  {
    if ( ! this.headers ) {
      this.headers = Object.create( null );
    }

    this.headers[ key.trim() ] = value.trim();
    return this;
  }

  bearer( token )
  {
    return this.header('Authorization', `Bearer ${token}`);
  }
}

export default APIRequest;
