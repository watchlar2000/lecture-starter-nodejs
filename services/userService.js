import { userRepository } from '../repositories/userRepository.js';

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async findAll() {
    return this.userRepository.getAll();
  }

  async findById(id) {
    return this.userRepository.getOne({ id });
  }

  async findByEmail(email) {
    return this.userRepository.getOne({ email });
  }

  async create(data) {
    return this.userRepository.create(data);
  }

  async update({ id, dataToUpdate }) {
    return this.userRepository.update(id, dataToUpdate);
  }

  async delete(id) {
    return this.userRepository.delete(id);
  }
}

const userService = new UserService({ userRepository });

export { userService };
