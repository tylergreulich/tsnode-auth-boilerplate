import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
const test = require('../config/test');

import { router as UserRouter } from '../routes/api/users';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    const MONGO_URI: string = test.TEST_DB;
    mongoose.connect(
      MONGO_URI || process.env.MONGODB_URI,
      { useNewUrlParser: true }
    );

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    require('../config/passport')(passport);
  }

  public routes(): void {
    const routes: express.Router = express.Router();
    routes.use('/api/users', UserRouter);
    this.app.use('/', routes);
  }
}

export default new Server().app;
