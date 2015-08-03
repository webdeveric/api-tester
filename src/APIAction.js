import FED from './fed.js';

class APIAction extends FED.Model
{
  constructor( attributes = {} )
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
  }
}

export default APIAction;
