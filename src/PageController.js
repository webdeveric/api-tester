import FED from './fed';

class PageController extends FED.Controller
{
  constructor()
  {
    super();
  }

  run( { page = 'home' } = {} )
  {
    console.info( `You requested ${page}` );
    document.getElementById('content').innerHTML = `<p>${page}</p>`;
  }
}

export default PageController;
