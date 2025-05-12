import { userRepository } from '../repositories/userRepository.js';
import { passwordManager } from '../utils/passwordManager.js';
import { BaseService } from './baseService.js';

class UserService extends BaseService {
  constructor({ userRepository }) {
    super({
      repository: userRepository,
    });
  }

  async create(data) {
    const { password, ...userData } = data;
    const { generateHash } = passwordManager();
    const hashedPasswordData = await generateHash(password);

    if (!hashedPasswordData) {
      return null;
    }

    const { hash: passwordHash, salt: passwordSalt } = hashedPasswordData;
    const newUser = {
      ...userData,
      passwordHash,
      passwordSalt,
    };
    return this.repository.create(newUser);
  }

  async verify({ password, hash, salt }) {
    const { verify } = passwordManager();
    return await verify({ password, hash, salt });
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
