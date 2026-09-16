class Database {
  constructor() {
    this.collections = new Map();

    console.log('💾 BaziGardaan Database initialized');
  }

  createCollection(name) {
    if (!name) {
      throw new Error('Collection name is required.');
    }

    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }

    return this.collections.get(name);
  }

  getCollection(name) {
    return this.collections.get(name) || null;
  }

  hasCollection(name) {
    return this.collections.has(name);
  }

  set(collectionName, id, data) {
    if (!collectionName) {
      throw new Error('Collection name is required.');
    }

    if (
      id === null ||
      id === undefined ||
      String(id).trim() === ''
    ) {
      throw new Error('Record ID is required.');
    }

    const collection = this.createCollection(
      collectionName
    );

    collection.set(String(id), {
      ...data,
      id: String(id),
      updatedAt: Date.now()
    });

    return collection.get(String(id));
  }

  get(collectionName, id) {
    const collection = this.getCollection(
      collectionName
    );

    if (!collection) {
      return null;
    }

    return collection.get(String(id)) || null;
  }

  has(collectionName, id) {
    const collection = this.getCollection(
      collectionName
    );

    if (!collection) {
      return false;
    }

    return collection.has(String(id));
  }

  update(collectionName, id, data = {}) {
    const existing = this.get(
      collectionName,
      id
    );

    if (!existing) {
      return null;
    }

    return this.set(
      collectionName,
      id,
      {
        ...existing,
        ...data,
        id: String(id)
      }
    );
  }

  delete(collectionName, id) {
    const collection = this.getCollection(
      collectionName
    );

    if (!collection) {
      return false;
    }

    return collection.delete(String(id));
  }

  getAll(collectionName) {
    const collection = this.getCollection(
      collectionName
    );

    if (!collection) {
      return [];
    }

    return Array.from(collection.values());
  }

  count(collectionName) {
    const collection = this.getCollection(
      collectionName
    );

    return collection
      ? collection.size
      : 0;
  }

  clearCollection(collectionName) {
    const collection = this.getCollection(
      collectionName
    );

    if (!collection) {
      return false;
    }

    collection.clear();

    return true;
  }

  deleteCollection(collectionName) {
    return this.collections.delete(
      collectionName
    );
  }

  listCollections() {
    return Array.from(
      this.collections.keys()
    );
  }

  clearAll() {
    this.collections.clear();
  }
}

const database = new Database();

export default database;
