const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: {
        _id: { type: Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
      },
      quantity: { type: Number, required: true },
    },
  ],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Order', orderSchema);
