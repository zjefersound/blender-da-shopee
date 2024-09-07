import { LAYER_NAMES } from "./constants.mjs";

export class Layers {
  constructor(initialItems = []) {
    this.items = initialItems;
  }
  setItems(items) {
    this.items = items;
  }
  getItems() {
    return this.items;
  }
  remove(id) {
    this.items = this.items.filter((l) => l.id !== id);
  }
  push(item) {
    this.items.push(item);
  }

  generateName(type) {
    const newName =
      LAYER_NAMES[type] +
      " " +
      (this.items.filter((l) => l.type === type).length + 1);
    return newName;
  }
}
