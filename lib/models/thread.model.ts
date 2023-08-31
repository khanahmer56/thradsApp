import mongoose from "mongoose";
const threadschema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parent: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
});
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadschema);
export default Thread;
