const express = require("express");
const { upload, uploadFile } = require("../controllers/files.controller");
const {
  predictDiseaseHandler,
} = require("../controllers/prediction.controller");
const router = express.Router();

router.post("/upload-file", upload.single("image"), uploadFile);
router.post("/prediction", predictDiseaseHandler);

module.exports = router;
