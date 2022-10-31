const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, userId, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      const _id = this._id;

      dbOp = db.collection('products').updateOne(
        { _id },
        {
          $set: this,
        }
      );
    } else {
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp.then((result) => result).catch((err) => console.log(err));
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

  static deleteById(id) {
    const _id = new ObjectId(id);
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id })
      .then((deleted) => deleted)
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
