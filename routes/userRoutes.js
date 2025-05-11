import { Router } from 'express';
import {
  createUserValid,
  updateUserValid,
} from '../middlewares/user.validation.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeToResponseLocals } from '../utils/writeToResponseLocals.js';

class UserController {
  constructor({ userService }) {
    this.userService = userService;
    this.router = Router();
    this.initRoutes();
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

  #updateResponseLocals(res) {
    return writeToResponseLocals(res);
  }

  async #checkUserExists({ id, res }) {
    const { setError } = this.#updateResponseLocals(res);
    const user = await this.userService.findById(id);

    if (!user) {
      setError({
        status: 404,
        message: `User with id ${id} not found`,
      });
      return null;
    }

    return user;
  }

  async #checkUniqueFields({ userData, res }) {
    const { setError } = this.#updateResponseLocals(res);
    const { email, phone } = userData;
    const isUserWithEmailExists = await this.userService.findByEmail(email);

    if (isUserWithEmailExists) {
      setError({
        status: 400,
        message: `User with email ${email} already exists`,
      });
      return false;
    }

    const isUserWithPhoneExists = await this.userService.findByPhone(phone);

    if (isUserWithPhoneExists) {
      setError({
        status: 400,
        message: `User with phone ${phone} already exists`,
      });
      return false;
    }

    return true;
  }

  async #handleResponse({ data, res, errorMessage }) {
    const { setData, setError } = this.#updateResponseLocals(res);

    if (!data) {
      setError({
        message: errorMessage,
      });
      return;
    }

    setData(data);
    return;
  }

  async getAll(req, res, next) {
    const users = await this.userService.findAll();
    this.#handleResponse({
      data: users,
      res,
      errorMessage: 'Something went wrong fetching users',
    });
    next();
  }

  async getById(req, res, next) {
    const { id } = req.params;
    const user = await this.findById(id);
    this.#handleResponse({
      data: user,
      res,
      errorMessage: `User with id ${id} not found`,
    });
    next();
  }

  async create(req, res, next) {
    const data = req.body;
    const isUniqueFields = await this.#checkUniqueFields({
      userData: data,
      res,
    });

    if (!isUniqueFields) {
      return next();
    }

    const user = await this.userService.create(data);
    this.#handleResponse({
      data: user,
      res,
      errorMessage: 'Something went wrong creating a user',
    });
    next();
  }

  async update(req, res, next) {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const isUserExists = await this.#checkUserExists({ id, res });

    if (!isUserExists) {
      return next();
    }

    const user = await this.userService.update({ id, dataToUpdate });
    this.#handleResponse({
      data: user,
      res,
      errorMessage: 'Something went wrong updating the user',
    });
    next();
  }

  async delete(req, res, next) {
    const { id } = req.params;
    const user = await this.#checkUserExists({ id, res });

    if (!user) {
      return next();
    }

    await this.userService.delete(id);
    const { setData } = this.#updateResponseLocals(res);
    setData(user);
    next();
  }

  getRouter() {
    return this.router;
  }
}

const router = ({ userService }) => {
  const controller = new UserController({ userService });
  return controller.getRouter();
};

export { router };
