import { Router } from 'express';
import {
  createUserValid,
  updateUserValid,
} from '../middlewares/user.validation.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { responseHelper } from '../utils/responseHelper.js';

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

  updateResponseLocals(res) {
    return responseHelper(res);
  }

  async getAll(req, res, next) {
    const users = await this.userService.findAll();
    const { setData } = this.updateResponseLocals(res);
    setData(users);
    next();
  }

  async getById(req, res, next) {
    const { id } = req.params;
    const user = await this.userService.findById(id);
    const { setData, setError } = this.updateResponseLocals(res);

    if (!user) {
      setError({
        status: 404,
        message: `User with id ${id} not found`,
      });
    } else {
      setData(user);
    }

    next();
  }

  async create(req, res, next) {
    const data = req.body;
    const { setData, setError } = this.updateResponseLocals(res);
    const isUserWithEmailExists = await this.userService.findByEmail(
      data.email,
    );

    if (isUserWithEmailExists) {
      setError({
        status: 400,
        message: `User with email ${data.email} already exists`,
      });
      return next();
    }

    const isUserWithPhoneExists = await this.userService.findByPhone(
      data.phone,
    );

    if (isUserWithPhoneExists) {
      setError({
        status: 400,
        message: `User with phone ${data.phone} already exists`,
      });
      return next();
    }

    const user = await this.userService.create(data);

    if (!user) {
      setError({
        message: 'Something went wrong creating a user',
      });
    } else {
      setData(user);
    }

    next();
  }

  async update(req, res, next) {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const user = await this.userService.update({ id, dataToUpdate });
    const { setData, setError } = this.updateResponseLocals(res);

    if (!user) {
      setError({
        message: 'Something went wrong updating a user',
      });
    } else {
      setData(user);
    }
    next();
  }

  async delete(req, res, next) {
    const { id } = req.params;
    const user = await this.userService.delete(id);
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
