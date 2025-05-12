import { Router } from 'express';
import { writeToResponseLocals } from '../utils/writeToResponseLocals.js';

class BaseController {
  constructor({ service, entityName }) {
    this.entityName = entityName;
    this.service = service;
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    throw new Error(
      'initRoutes method must be implemented in the child class.',
    );
  }

  _updateResponseLocals(res) {
    return writeToResponseLocals(res);
  }

  async _checkEntityExists({ id, res }) {
    const { setError } = this._updateResponseLocals(res);
    const entity = await this.service.findById(id);

    if (!entity) {
      setError({
        status: 404,
        message: `${this.entityName} with id ${id} not found`,
      });
      return null;
    }

    return entity;
  }

  async _handleResponse({ data, res, errorMessage }) {
    const { setData, setError } = this._updateResponseLocals(res);

    if (!data) {
      setError({
        status: 404,
        message: errorMessage,
      });
      return;
    }

    setData(data);
    return;
  }

  async getAll(req, res, next) {
    const data = await this.service.findAll();
    this._handleResponse({
      data,
      res,
      errorMessage: `Something went wrong fetching ${this.entityName}s`,
    });
    next();
  }

  async getById(req, res, next) {
    const { id } = req.params;
    const data = await this.service.findById(id);
    this._handleResponse({
      data,
      res,
      errorMessage: `${this.entityName} with id ${id} not found`,
    });
    next();
  }

  async create(req, res, next) {
    const { body } = req;
    const data = await this.service.create(body);
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
    const isEntityExists = await this._checkEntityExists({ id, res });

    if (!isEntityExists) {
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

  async delete(req, res, next) {
    const { id } = req.params;
    const entity = await this._checkEntityExists({ id, res });

    if (!entity) {
      return next();
    }

    await this.service.delete(id);
    const { setData } = this._updateResponseLocals(res);
    setData(entity);
    next();
  }

  getRouter() {
    return this.router;
  }
}

export { BaseController };
