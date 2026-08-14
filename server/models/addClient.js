const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  client: String,
  data: String,
  percentage: String,
  tel: String,
  price: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  creationDateTime: {
    type: Date,
    default: Date.now
  }
});

const addClient = mongoose.model('addClient', clientSchema);

module.exports = addClient;