import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import playerRoutes from './routes/player.routes';
import matchRoutes from './routes/match.routes';
import integrationRoutes from './routes/integration.routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use('/players', playerRoutes);
app.use('/matches', matchRoutes);
app.use('/integrations', integrationRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.send('Flunk API is running');
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
