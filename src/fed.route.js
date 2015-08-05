import Controller from './fed.controller.js';

const routeParamPattern = /\:([\w\d_-]+)/gi;

class Route
{
  constructor( route, handler )
  {
    this._route = null;
    this._regex = null;
    this._handler = null;

    // this.data = Object.create( null );

    this.route = route;
    this.handler = handler;
  }

  set route( value )
  {
    this._route = value.replace(/\/{2,}/g, '/');

    if ( this._route.substr(-1) !== '/' ) {
      this._route += '/';
    }

    this._regex = null;

    console.log( `Setting route value to ${this._route}` );
  }

  get route()
  {
    return this._route;
  }

  set handler( handler )
  {
    // TODO: replace this with "handler instanceof FED.Runnable"
    if ( ( typeof handler === 'object' && typeof handler.run === 'function' ) || typeof handler === 'object' ) {
      return this._handler = handler;
    }

    throw new TypeError('Route handler must be a function or an Object with a run method.');
  }

  get handler()
  {
    return this._handler;
  }

  get regex()
  {
    if ( ! this._regex ) {
      this._regex = Route.toRegex( this.route );
    }

    return this._regex;
  }

  handleEvent( e )
  {
    console.log( e );
  }

  get parameters()
  {
    const keys   = this.route.match( routeParamPattern );
    const values = this.regex.exec( document.location.pathname );
    const params = Object.create( null );

    if ( values ) { // Remove the matched text.
      values.shift();
    }

    if ( keys ) { // Remove parameter indicator.

      for ( let i = 0, l = keys.length ; i < l ; ++i ) {
        if ( values && values[ i ] !== void 0 ) {
          let key = keys[ i ].replace(':', '');
          params[ key ] = values[ i ];
        }
      }

    }

    return params;
  }

  static toRegex( route )
  {
    const regex = route
                    .replace(/\/{2,}/g, '\/')
                    .replace( /\//g, '\\/' )
                    .replace( routeParamPattern, '([\\w\\d_-]+)' )
                    .replace( /\/$/g, '\/?' );

    return new RegExp( `^${regex}$` );
  }

  test()
  {
    return this.regex.test( document.location.pathname );
  }

  run()
  {
    if ( this.handler instanceof Controller ) {

      this.handler.run( this.parameters );

    } else if ( typeof this.handler === 'function' ) {

      this.handler( this.parameters );

    }

    // const params = this.regex.exec( document.location.pathname ).slice(1);

    // if ( this.handler instanceof Controller ) {

    //   if ( params.length ) {
    //     this.handler.run.apply( this.handler, params );
    //   } else {
    //     this.handler.run();
    //   }

    // } else if ( typeof this.handler === 'function' ) {

    //   if ( params.length ) {
    //     this.handler.apply( null, params );
    //   } else {
    //     this.handler();
    //   }

    // }
  }

}

export default Route;
