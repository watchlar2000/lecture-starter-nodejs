import {
  createUserValid,
  updateUserValid,
} from '../middlewares/user.validation.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BaseController } from './baseRoute.js';

class UserController extends BaseController {
  constructor({ userService }) {
    super({ service: userService, entityName: 'User' });
  }

  initRoutes() {
    this.router.get('/', asyncHandler(this.getAll.bind(this)));
    this.router.get('/:id', asyncHandler(this.getById.bind(this)));
    this.router.post(
      '/',
      createUserValid,
      asyncHandler(this.create.bind(this)),
    );
    this.router.patch(
      '/:id',
      updateUserValid,
      asyncHandler(this.update.bind(this)),
    );
    this.router.delete('/:id', asyncHandler(this.delete.bind(this)));
  }

  async #checkUniqueFields({ userData, res }) {
    const { setError } = this._updateResponseLocals(res);
    const { email, phone } = userData;
    const isUserWithEmailExists = await this.service.findByEmail(email);

    if (isUserWithEmailExists) {
      setError({
        status: 400,
        message: `User with email ${email} already exists`,
      });
      return false;
    }

    const isUserWithPhoneExists = await this.service.findByPhone(phone);

    if (isUserWithPhoneExists) {
      setError({
        status: 400,
        message: `User with phone ${phone} already exists`,
      });
      return false;
    }

    return true;
  }

  async create(req, res, next) {
    const { body: userData } = req;
    const isUniqueFields = await this.#checkUniqueFields({
      userData,
      res,
    });

    if (!isUniqueFields) {
      return next();
    }

    const data = await this.service.create(userData);
    this._handleResponse({
      data,
      res,
      errorMessage: 'Something went wrong creating a user',
    });
    next();
  }
}

const router = ({ userService }) => {
  const controller = new UserController({ userService });
  return controller.getRouter();
};

export { router };
