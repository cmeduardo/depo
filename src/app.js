import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { appConfig } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

app.use(appConfig.apiPrefix, routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
