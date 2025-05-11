import { fighterRepository } from '../repositories/fighterRepository.js';

class FighterService {
  constructor({ fighterRepository }) {
    this.fighterRepository = fighterRepository;
  }

  async findAll() {
    return this.fighterRepository.getAll();
  }

  async findById(id) {
    return this.fighterRepository.getOne({ id });
  }

  async create(data) {
    return this.fighterRepository.create(data);
  }

  async update({ id, dataToUpdate }) {
    return this.fighterRepository.update(id, dataToUpdate);
  }

  async delete(id) {
    return this.fighterRepository.delete(id);
  }
}

const fighterService = new FighterService({ fighterRepository });

export { fighterService };
