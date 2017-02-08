module.exports = class Person {
  constructor(name){
    this.name = name;
    return this;
  }

  hello(){
    return `HEJ ${this.name}`;
  }
}
