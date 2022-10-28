const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
  constructor(userName, email, id) {
    this.userName = userName;
    this.email = email;
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      const _id = this._id;
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
