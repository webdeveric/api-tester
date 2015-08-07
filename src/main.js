// import 'babelify/polyfill';
import FED from './fed';
import APIFormController from './APIFormController';

let App = null;

try {

  App = new FED.App(
    'API Test',
    '0.1.0',
    new FED.Router()
  );

  App.router.add( new FED.Route('/', new APIFormController ) );

  App.init();

} catch ( error ) {

  console.error( error );

}
