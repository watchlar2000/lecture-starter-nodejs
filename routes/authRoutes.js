import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { writeToResponseLocals } from '../utils/writeToResponseLocals.js';

class AuthController {
  constructor({ authService }) {
    this.authService = authService;
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/login', asyncHandler(this.login.bind(this)));
  }

  #updateResponseLocals(res) {
    return writeToResponseLocals(res);
  }

  async _handleResponse({ data, res, errorMessage }) {
    const { setData, setError } = this.#updateResponseLocals(res);

    if (!data) {
      setError({
        status: 401,
        message: errorMessage,
      });
      return;
    }

    setData(data);
    return;
  }

  async login(req, res, next) {
    const data = await this.authService.login(req.body);
    this._handleResponse({
      data,
      res,
      errorMessage: 'Invalid email or password',
    });
    next();
  }

  getRouter() {
    return this.router;
  }
}

const router = ({ authService }) => {
  const controller = new AuthController({ authService });
  return controller.getRouter();
};

export { router };
