import { router as authRoutes } from './authRoutes.js';
import { router as fighterRoutes } from './fighterRoutes.js';
import { router as fightRoutes } from './fightRoutes.js';
import { router as userRoutes } from './userRoutes.js';

import { responseMiddleware } from '../middlewares/response.middleware.js';
import { authService } from '../services/authService.js';
import { fighterService } from '../services/fighterService.js';
import { userService } from '../services/userService.js';

const initRoutes = (app) => {
  app.use('/api/users', userRoutes({ userService }), responseMiddleware);
  app.use(
    '/api/fighters',
    fighterRoutes({ fighterService }),
    responseMiddleware,
  );
  app.use('/api/fights', fightRoutes);
  app.use('/api/auth', authRoutes({ authService }), responseMiddleware);
};

export { initRoutes };
