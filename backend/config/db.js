import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists for embedded document persistence
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongooseConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim().length > 0) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      isMongooseConnected = true;
      console.log('✅ Connected to MongoDB via Mongoose');
      return true;
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed, using local embedded persistent store:', err.message);
      isMongooseConnected = false;
      return false;
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Using embedded JSON document storage.');
    isMongooseConnected = false;
    return false;
  }
};

export const getIsMongooseConnected = () => isMongooseConnected;

/**
 * Lightweight file-backed document store that mirrors Mongoose model behavior
 * for environments without a running MongoDB daemon.
 */
export class EmbeddedStore {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error(`Error loading data for ${this.collectionName}:`, err.message);
    }
    return [];
  }

  saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error saving data for ${this.collectionName}:`, err.message);
    }
  }

  async findOne(filter = {}) {
    return this.data.find(item => this.matchesFilter(item, filter)) || null;
  }

  async findById(id) {
    return this.data.find(item => item._id === id || item.id === id) || null;
  }

  find(filter = {}) {
    let results = this.data.filter(item => this.matchesFilter(item, filter));
    
    // Support chainable methods: .sort(), .limit()
    const queryObj = {
      _results: results,
      sort(sortObj = {}) {
        const [field, order] = Object.entries(sortObj)[0] || [];
        if (field) {
          queryObj._results.sort((a, b) => {
            const valA = a[field] || '';
            const valB = b[field] || '';
            if (valA < valB) return order === -1 ? 1 : -1;
            if (valA > valB) return order === -1 ? -1 : 1;
            return 0;
          });
        }
        return queryObj;
      },
      limit(n) {
        queryObj._results = queryObj._results.slice(0, n);
        return queryObj;
      },
      then(resolve, reject) {
        return Promise.resolve(queryObj._results).then(resolve, reject);
      },
      catch(reject) {
        return Promise.resolve(queryObj._results).catch(reject);
      }
    };

    return queryObj;
  }

  async create(doc) {
    const _id = doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newDoc = {
      ...doc,
      _id,
      id: _id,
      createdAt: doc.createdAt || now,
      updatedAt: now,
    };
    this.data.push(newDoc);
    this.saveData();
    return newDoc;
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const index = this.data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    const updated = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data[index] = updated;
    this.saveData();
    return updated;
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const [deleted] = this.data.splice(index, 1);
    this.saveData();
    return deleted;
  }

  async countDocuments(filter = {}) {
    return this.data.filter(item => this.matchesFilter(item, filter)).length;
  }

  matchesFilter(item, filter) {
    for (const key of Object.keys(filter)) {
      if (key === '$or' && Array.isArray(filter.$or)) {
        const matchAny = filter.$or.some(subFilter => this.matchesFilter(item, subFilter));
        if (!matchAny) return false;
        continue;
      }
      if (filter[key] instanceof RegExp) {
        if (!filter[key].test(item[key])) return false;
      } else if (item[key] !== filter[key]) {
        // loose id comparison
        if (key === '_id' && item.id === filter[key]) continue;
        return false;
      }
    }
    return true;
  }
}
