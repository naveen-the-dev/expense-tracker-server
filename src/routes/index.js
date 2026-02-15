const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

router.use("/types", require("./typeRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/transactions", require("./transactionRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));

module.exports = router;
