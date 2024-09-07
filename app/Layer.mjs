export class Layer {
  constructor(type, name) {
    this.id = Math.random();
    this.type = type;
    this.name = name;
  }

  setType(type) {
    this.type = type;
  }

  setName(name) {
    this.name = name;
  }
}
