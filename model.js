const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: String,
  category: String,
});

module.exports = mongoose.model("Ticket", ticketSchema);
