const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();

    return db
      .collection('products')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fecthAll() {
    const db = getDb();

    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    const _id = new ObjectId(id);

    return db
      .collection('products')
      .findOne({ _id })
      .then((product) => product)
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
