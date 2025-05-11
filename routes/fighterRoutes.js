import {
  createFighterValid,
  updateFighterValid,
} from '../middlewares/fighter.validation.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BaseController } from './baseRoute.js';

class FighterController extends BaseController {
  constructor({ fighterService }) {
    super({ service: fighterService, entityName: 'Fighter' });
  }

  initRoutes() {
    this.router.get('/', asyncHandler(this.getAll.bind(this)));
    this.router.get('/:id', asyncHandler(this.getById.bind(this)));
    this.router.post(
      '/',
      createFighterValid,
      asyncHandler(this.create.bind(this)),
    );
    this.router.patch(
      '/:id',
      updateFighterValid,
      asyncHandler(this.update.bind(this)),
    );
    this.router.delete('/:id', asyncHandler(this.delete.bind(this)));
  }
}

const router = ({ fighterService }) => {
  const controller = new FighterController({ fighterService });
  return controller.getRouter();
};

export { router };
