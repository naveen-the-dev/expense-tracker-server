const Category = require("../models/Category");
const Type = require("../models/Type");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, typeId, color } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({ message: "Name and typeId are required" });
    }

    // Check if type exists
    const typeExists = await Type.findById(typeId);
    if (!typeExists) {
      return res.status(404).json({ message: "Type not found" });
    }

    const category = await Category.create({ name, typeId, color });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Category already exists in this type" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get Categories (optionally filter by typeId)
exports.getCategories = async (req, res) => {
  try {
    const { typeId } = req.query;

    let filter = {};
    if (typeId) filter.typeId = typeId;

    const categories = await Category.find(filter)
      .populate("typeId", "name color") // ✅ include color
      .sort({ createdAt: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, color },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
