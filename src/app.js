import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { appConfig } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';

const app = express();
app.use(helmet());
const corsOptions = {
  origin: appConfig.cors.allowedOrigins.includes('*') ? true : appConfig.cors.allowedOrigins,
  credentials: appConfig.cors.allowCredentials
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('combined'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use(appConfig.apiPrefix, routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
