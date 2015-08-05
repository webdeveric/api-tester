function typeSetter( field, type, storage )
{
  storage[ field ] = void 0;

  switch ( type.toLowerCase() ) {
    case 'string':
      return function setString( value ) { storage[ field ] = value + ''; };
    case 'number':
      return function setNumber( value ) { storage[ field ] = new Number( value ); };
    case 'int':
    case 'integer':
      return function setInteger( value ) { storage[ field ] = parseInt( value, 10 ); };
    case 'float':
      return function setFloat( value ) { storage[ field ] = parseFloat( value ); };
    case 'boolean':
      return function setBoolean( value ) { storage[ field ] = new Boolean( value ); };
    case 'object':
      return function setObject( value ) { storage[ field ] = new Object( value ); };
    default:
      return function setDefault( value ) { storage[ field ] = value; };
  }
}

class Model
{
  constructor( { fields = {}, attributes = {} } = {} )
  {
    this.fields = {};

    for ( let f in fields ) {
      this.setField( f, fields[ f ] );
    }

    for ( let attribute in attributes ) {
      if ( this.fields.hasOwnProperty( attribute ) ) {
        this[ attribute ] = attributes[ attribute ];
      }
    }
  }

  setField( field, type )
  {
    Object.defineProperty( this, field, {
      get: () => this.fields[ field ],
      set: typeSetter( field, type, this.fields )
    });
  }

}

export default Model;
