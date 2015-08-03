// import 'babelify/polyfill';
import FED from './fed.js';
import APIForm from './APIForm.js';
import APIAction from './APIAction.js';

class AdminPanel extends FED.Controller
{
  constructor()
  {
    super();
  }
}

class HomeController extends FED.Controller
{
  constructor()
  {
    super();
  }

  run( { page = 'home' } = {} )
  {
    console.info( `You requested ${page}` );
  }
}

let App = null;

try {

  App = new FED.App(
    'API Test',
    '0.1.0',
    new FED.Router('/api-tester/')
  );

  App.router.add( new FED.Route('/:page?', new HomeController ) );
  // App.router.add( new FED.Route('/api-tester/admin/:panel/:name?/', function adminPanel( panel, name ) { console.log( panel, name ); } ) );

  App.init();

} catch ( error ) {

  console.error( error );

}


window.addEventListener('load', () => {

  Array.prototype.slice.call(
    document.querySelectorAll('.api-nav > a'),
    0
  ).forEach( ( anchor ) => {
    anchor.addEventListener('click', function( e ) {
      e.preventDefault();
      App.navigate( this.href, this.getAttribute('data-title') || this.textContent );
    });
  });

//   const authAction = new APIAction({
//     method: 'POST',
//     url: 'http://unexpected-drives.dev/api/v1/auth',
//     data: 'email=eric.king@lonelyplanet.com&password=lp1234',
//     // headers: {
//     //   authorization: 'bearer ...'
//     // }
//     success: ( data ) => {

//     },
//     failure: ( error ) => {

//     }
//   });

//   const form = new APIForm(
//     document.querySelector('#api-form')
//   );

//   form.registerAction( 'Authenticate', authAction );

//   // form.submit();

}, false );
