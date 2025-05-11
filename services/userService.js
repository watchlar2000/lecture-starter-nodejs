import { userRepository } from '../repositories/userRepository.js';
import { BaseService } from './baseService.js';

class UserService extends BaseService {
  constructor({ userRepository }) {
    super({
      repository: userRepository,
    });
  }

  async findByEmail(email) {
    return this.repository.getOne({ email });
  }

  async findByPhone(phone) {
    return this.repository.getOne({ phone });
  }
}

const userService = new UserService({ userRepository });

export { userService };
