const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(userName, email, cart, id) {
    this.userName = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      const _id = new ObjectId(this._id);
      dbOp = db.collection('users').updateOne(
        { _id },
        {
          $set: this,
        }
      );
    } else {
      dbOp = db.collection('users').insertOne(this);
    }

    return dbOp.then((result) => result).catch((err) => console.log(err));
  }

  addCart(product) {
    const db = getDb();
    const _id = this._id;
    const productId = product._id;
    const items = this.cart?.items ? this.cart.items : [];

    const cartProductIndex = items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    cartProductIndex !== -1
      ? items[cartProductIndex].quantity++
      : items.push({ productId, quantity: 1 });

    return db
      .collection('users')
      .updateOne({ _id }, { $set: { cart: { items } } })
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) =>
        this.cart.items.map((item) => {
          const productDetail = products.find(
            (product) => item.productId.toString() === product._id.toString()
          );
          return {
            _id: productDetail._id,
            title: productDetail.title,
            quantity: item.quantity,
          };
        })
      )
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const _id = this._id;
    const items = this.cart?.items ? this.cart.items : [];

    const filteredItems = items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    return db
      .collection('users')
      .updateOne({ _id }, { $set: { cart: { items: filteredItems } } })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    const _id = new ObjectId(id);

    return db
      .collection('users')
      .findOne({ _id })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
