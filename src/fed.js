import App from './fed.app.js';
import Route from './fed.route.js';
import Router from './fed.router.js';
import Model from './fed.model.js';
import View from './fed.view.js';
import Controller from './fed.controller.js';

const FED = {
  get version() { return '0.1.0' },
  App,
  Route,
  Router,
  Model,
  View,
  Controller,
};

export default FED;
