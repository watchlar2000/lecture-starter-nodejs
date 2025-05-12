import { fighterRepository } from '../repositories/fighterRepository.js';
import { BaseService } from './baseService.js';

class FighterService extends BaseService {
  constructor({ fighterRepository }) {
    super({
      repository: fighterRepository,
    });
  }

  async findByName(name) {
    return this.repository.getOne({ name });
  }
}

const fighterService = new FighterService({ fighterRepository });

export { fighterService };
