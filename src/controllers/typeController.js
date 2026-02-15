const Type = require("../models/Type");

// Create Type
exports.createType = async (req, res) => {
  try {
    const { name,color } = req.body;

    const existing = await Type.findOne({ name,color });
    if (existing) {
      return res.status(400).json({ message: "Type already exists" });
    }

    const type = await Type.create({ name });

    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Types
exports.getTypes = async (req, res) => {
  try {
    const types = await Type.find().sort({ createdAt: 1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Type
exports.updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,color } = req.body;

    const updated = await Type.findByIdAndUpdate(id, { name,color }, { new: true });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Type
exports.deleteType = async (req, res) => {
  try {
    const { id } = req.params;

    await Type.findByIdAndDelete(id);

    res.json({ message: "Type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
