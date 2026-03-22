const express = require("express");
const router = express.Router();
const asset = require("../controllers/assetController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, asset.getAssets);
router.post("/claim/:id", authMiddleware, asset.claimAsset);
router.get("/my", authMiddleware, asset.getMyAssets);

module.exports = router;