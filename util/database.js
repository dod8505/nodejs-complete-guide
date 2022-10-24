const { MongoClient, ServerApiVersion } = require('mongodb');

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://user-application:Passclusterpractices.seodmo3.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
