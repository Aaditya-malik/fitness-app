import mongoose from 'mongoose';
import { EmbeddedStore, getIsMongooseConnected } from '../config/db.js';

export function createDualModel(modelName, schemaDef) {
  const schema = new mongoose.Schema(schemaDef, { timestamps: true });
  let mongooseModel;
  try {
    mongooseModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
  } catch (err) {
    mongooseModel = mongoose.model(modelName, schema);
  }

  const embeddedStore = new EmbeddedStore(modelName.toLowerCase() + 's');

  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (getIsMongooseConnected()) {
        return target[prop];
      }
      if (prop in embeddedStore) {
        return typeof embeddedStore[prop] === 'function'
          ? embeddedStore[prop].bind(embeddedStore)
          : embeddedStore[prop];
      }
      return target[prop];
    }
  });
}
