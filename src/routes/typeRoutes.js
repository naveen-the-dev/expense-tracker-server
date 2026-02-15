const express = require("express");
const router = express.Router();

const {
  createType,
  getTypes,
  updateType,
  deleteType,
} = require("../controllers/typeController");

router.post("/", createType);
router.get("/", getTypes);
router.put("/:id", updateType);
router.delete("/:id", deleteType);

module.exports = router;
