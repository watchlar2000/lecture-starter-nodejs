import { fighterRepository } from '../repositories/fighterRepository.js';
import { BaseService } from './baseService.js';

class FighterService extends BaseService {
  constructor({ fighterRepository }) {
    super({
      repository: fighterRepository,
    });
  }

  // async findAll() {
  //   return this.fighterRepository.getAll();
  // }

  // async findById(id) {
  //   return this.fighterRepository.getOne({ id });
  // }

  // async create(data) {
  //   return this.fighterRepository.create(data);
  // }

  // async update({ id, dataToUpdate }) {
  //   return this.fighterRepository.update(id, dataToUpdate);
  // }

  // async delete(id) {
  //   return this.fighterRepository.delete(id);
  // }
}

const fighterService = new FighterService({ fighterRepository });

export { fighterService };
