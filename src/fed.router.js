class Router
{
  constructor( root = '' )
  {
    this.root = root;

    this.routes = [];

    // Maybe use a WeakMap to track the states of routes when calling pushState()
    window.addEventListener( 'popstate', this, false );
  }

  pushState( state, title, url )
  {
    window.history.pushState( state, title, url );
    this.run();
  }

  replaceState( state, title, url )
  {
    window.history.replaceState( state, title, url );
    this.run();
  }

  get currentState()
  {
    return history.state;
  }

  handleEvent( e )
  {
    console.log( e );
    console.log( document.location.pathname );
  }

  add( /* Route */ route )
  {
    if ( this.root ) {
      route.route = `${this.root}/${route.route}`;
    }

    this.routes.push( route );
  }

  run()
  {
    console.log('Running router');

    for ( let i = 0, l = this.routes.length ; i < l ; ++i ) {
      if ( this.routes[ i ].test() ) {
        console.log('Route found');
        this.routes[ i ].run();
        break;
      } else {
        console.log( this.routes[ i ].route, this.routes[ i ].regex );
      }
    }
  }
}

export default Router;
