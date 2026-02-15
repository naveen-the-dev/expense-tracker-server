const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require("./routes");
app.use("/api", apiRoutes);

module.exports = app;
