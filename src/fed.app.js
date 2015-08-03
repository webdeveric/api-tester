class App
{
  constructor( name, version = '0.0.0', router = null )
  {
    this.name = name;
    this.version = version;
    this.router = router;

    this.state = Object.create( null );
  }

  init()
  {
    this.handleLoaded();

    console.log( this );
  }

  navigate( url, title = '' )
  {
    if ( this.router ) {
      if ( title ) {
        document.title = title;
      }
      this.state.currentUrl = url;
      this.router.pushState( this.state, title, url );
    }
  }

  handleEvent( e )
  {
    // console.log( e );
    // console.log( this.router.currentState );
    this.router.run();
  }

  /**
    Call handleEvent one time when the page has loaded or is complete.
  */
  handleLoaded()
  {
    if ( document.readyState === 'complete' ) {
      this.handleEvent( new CustomEvent('handleloaded') );
      return;
    }

    let handled = false;

    const tmpHandler = ( e ) => {
      if ( ! handled ) {
        handled = true;
        this.handleEvent( e );
      }
      document.removeEventListener( 'DOMContentLoaded', tmpHandler, false );
    };

    document.addEventListener( 'DOMContentLoaded', tmpHandler, false );
  }
}

export default App;
