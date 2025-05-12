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

  async #checkUniqueFields({ fighterData, res }) {
    const { setError } = this._updateResponseLocals(res);
    const { name } = fighterData;
    const isFighterWithNameExists = await this.service.findByName(name);

    if (isFighterWithNameExists) {
      setError({
        status: 400,
        message: `Fighter with name ${name} already exists`,
      });
      return false;
    }

    return true;
  }

  async create(req, res, next) {
    const { body: fighterData } = req;
    const isUniqueFields = await this.#checkUniqueFields({
      fighterData,
      res,
    });

    if (!isUniqueFields) {
      return next();
    }

    const data = await this.service.create(fighterData);
    this._handleResponse({
      data,
      res,
      errorMessage: `Something went wrong creating ${this.entityName}`,
    });
    next();
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { body: dataToUpdate } = req;
    const isFighterExists = await this._checkEntityExists({ id, res });

    if (!isFighterExists) {
      return next();
    }

    const isUniqueFields = await this.#checkUniqueFields({
      fighterData: dataToUpdate,
      res,
    });

    if (!isUniqueFields) {
      return next();
    }

    const data = await this.service.update({ id, dataToUpdate });
    this._handleResponse({
      data,
      res,
      errorMessage: `Something went wrong updating ${this.entityName}`,
    });
    next();
  }
}

const router = ({ fighterService }) => {
  const controller = new FighterController({ fighterService });
  return controller.getRouter();
};

export { router };
