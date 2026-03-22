
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});