import { randomUUID } from 'node:crypto';
import { dbAdapter } from '../config/db.js';

class BaseRepository {
  constructor(collectionName) {
    this.dbContext = dbAdapter.get(collectionName);
    this.collectionName = collectionName;
  }

  generateId() {
    return randomUUID();
  }

  getAll() {
    return this.dbContext.value();
  }

  getOne(search) {
    return this.dbContext.find(search).value();
  }

  create(data) {
    data.id = this.generateId();
    data.createdAt = new Date();
    const list = this.dbContext.push(data).write();
    return list.find((it) => it.id === data.id);
  }

  update(id, dataToUpdate) {
    dataToUpdate.updatedAt = new Date();
    return this.dbContext.find({ id }).assign(dataToUpdate).write();
  }

  delete(id) {
    return this.dbContext.remove({ id }).write();
  }
}

export { BaseRepository };
