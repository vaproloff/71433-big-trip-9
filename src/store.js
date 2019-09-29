class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getItems(storeKey) {
    const emptyItems = {};
    const items = this._storage.getItem(storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }

  setItem(storeKey, itemKey, item) {
    const items = this.getItems(storeKey);
    items[itemKey] = item;

    this._storage.setItem(storeKey, JSON.stringify(items));
  }

  removeItem(storeKey, itemKey) {
    const items = this.getItems(storeKey);
    delete items[itemKey];

    this._storage.setItem(storeKey, JSON.stringify(items));
  }
}

export default Store;
