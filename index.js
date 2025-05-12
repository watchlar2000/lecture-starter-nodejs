import cors from 'cors';
import express from 'express';
import { initRoutes } from './routes/routes.js';
import { gracefulShutdown } from './utils/gracefulShutdown.js';

import './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

app.use('/', express.static('./client/build'));

const port = 3050;
const server = app.listen(port, () => {});

process.on('SIGTERM', () => gracefulShutdown(server));
process.on('SIGINT', () => gracefulShutdown(server));

export { app };
