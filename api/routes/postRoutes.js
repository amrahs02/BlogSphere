const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/", uploadMiddleware.single("file"), postController.createPost);
router.put("/:id", uploadMiddleware.single("file"), postController.updatePost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

module.exports = router;
