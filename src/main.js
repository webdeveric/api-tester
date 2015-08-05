// import 'babelify/polyfill';
import FED from './fed';
import APIFormController from './APIFormController';
import PageController from './PageController';

let App = null;

try {

  App = new FED.App(
    'API Test',
    '0.1.0',
    new FED.Router('/api-tester/')
  );

  App.router.add( new FED.Route('/form', new APIFormController ) );
  App.router.add( new FED.Route('/:page?', new PageController ) );

  App.init();

} catch ( error ) {

  console.error( error );

}

function clearToken()
{
  window.sessionStorage.removeItem('api-token');
  console.log('Token cleared');
}

window.addEventListener('load', () => {

  document.querySelector('.js-clear-token').addEventListener('click', clearToken, false );

  Array.prototype.slice.call(
    document.querySelectorAll('.api-nav > a'),
    0
  ).forEach( ( anchor ) => {
    anchor.addEventListener('click', function( e ) {
      e.preventDefault();
      App.navigate( this.href, this.getAttribute('data-title') || this.textContent );
    });
  });

}, false );
