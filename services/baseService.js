class BaseService {
  constructor({ repository }) {
    this.repository = repository;
  }

  async findAll() {
    return this.repository.getAll();
  }

  async findById(id) {
    return this.repository.getOne({ id });
  }

  async create(data) {
    return this.repository.create(data);
  }

  async update({ id, dataToUpdate }) {
    return this.repository.update(id, dataToUpdate);
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}

export { BaseService };
