const { ref, required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true,trim: true },
  tags: { type: [String], default: [] } ,
  description: {
    type: String,
    default:[],
  },
  aiMetadata:{
    type: String,
    default:[],
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
},
  {timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);
