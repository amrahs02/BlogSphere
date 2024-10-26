const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  cover: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
