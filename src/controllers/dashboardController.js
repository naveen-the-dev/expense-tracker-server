const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getDashboard = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    let endDate = new Date(`${Number(year) + 1}-01-01`);

    // If month is provided → override date range
    if (month) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      startDate.setTime(start.getTime());
      endDate.setTime(end.getTime());
    }

    /* ================= AGGREGATE BY TYPE ================= */

    const byType = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$typeId",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "types",
          localField: "_id",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: "$type" },
      {
        $project: {
          _id: 0,
          typeId: "$type._id",
          name: "$type.name",
          color: "$type.color",
          total: 1,
        },
      },
    ]);

    /* ================= AGGREGATE BY CATEGORY ================= */

    const byCategory = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          typeId: "$category.typeId",
          name: "$category.name",
          color: {
            $cond: [
              { $ifNull: ["$category.color", false] },
              "$category.color",
              null,
            ],
          },
          total: 1,
        },
      },
    ]);

    /* ================= TOTAL ================= */

    const totalResult = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const total = totalResult.length ? totalResult[0].total : 0;

    res.json({
      summary: {
        total,
        byType,
        byCategory,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
