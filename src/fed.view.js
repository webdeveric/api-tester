class View
{
  constructor( filename, data = null )
  {
    this.filename = filename;
    this.data = data;
    this.content = null;
  }


  fetch()
  {
    if ( this.content ) {
      return Promise.resolve( this.content );
    }

    return window.fetch( this.filename ).then( ( response ) => {
      return response.text();
    }).then( ( content ) => {
      this.content = content;
      return this.content;
    });
  }

  process( content )
  {
    if ( this.data ) {
      // Find and replace data here.
      for ( let key in this.data ) {
        const value = this.data[ key ] + '';
        content = content.replace( new RegExp( `\{\{${key}\}\}`, 'gi' ), value );
      }
    }

    return content;
  }

  set( key, value )
  {
    if ( ! this.data ) {
      this.data = Object.create( null );
    }

    this.data[ key ] = value;

    return this;
  }

  renderInto( selector )
  {
    return this.fetch().then( ( content ) => {

      const element = document.querySelector( selector );

      if ( element ) {
        element.innerHTML = this.process( content );
        return element;
      }

      throw new Error( `${selector} did not match any elements` );

    });
  }

}

export default View;
