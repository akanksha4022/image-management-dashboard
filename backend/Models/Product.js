const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  tags: { type: [String], default: [] } // array of strings
});

module.exports = mongoose.model('Product', productSchema);
