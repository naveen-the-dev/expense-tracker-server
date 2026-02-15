const Transaction = require("../models/Transaction");
const Type = require("../models/Type");
const Category = require("../models/Category");

// Create Transaction
exports.createTransaction = async (req, res) => {
  try {
    const { typeId, categoryId, amount, note, date } = req.body;

    if (!typeId || !categoryId || !amount || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Validate Type
    const typeExists = await Type.findById(typeId);
    if (!typeExists) {
      return res.status(404).json({ message: "Type not found" });
    }

    // Validate Category
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const transaction = await Transaction.create({
      typeId,
      categoryId,
      amount,
      note,
      date,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Transactions (Optional Month Filter)
exports.getTransactions = async (req, res) => {
  try {
    const { month } = req.query;

    let filter = {};

    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const transactions = await Transaction.find(filter)
      .populate("typeId", "name color") // ✅ include color
      .populate("categoryId", "name color") // ✅ include color
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
