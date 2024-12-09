const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const notesRoutes = require("./routes/notesRoutes");

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/notes", notesRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
