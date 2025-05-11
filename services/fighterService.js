import { fighterRepository } from '../repositories/fighterRepository.js';
import { BaseService } from './baseService.js';

class FighterService extends BaseService {
  constructor({ fighterRepository }) {
    super({
      repository: fighterRepository,
    });
  }
}

const fighterService = new FighterService({ fighterRepository });

export { fighterService };
