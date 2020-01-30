import { Application } from 'express';

import api from './api';
import root from './root';

module.exports = (app: Application) => {
  app.use('/', root);
  app.use('/api', api);
};
