const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  note: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster month queries
transactionSchema.index({ date: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
