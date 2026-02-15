const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  color: {
    type: String,
    default: "", // optional override
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.index({ name: 1, typeId: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
