const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  client: String,
  data: String,
  percentage: String,
  tel: String,
  price: String,
  // Add any other fields as needed
});

const addClient = mongoose.model('addClient', clientSchema);

module.exports = addClient;