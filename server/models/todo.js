import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: String,
  tags: [String],
  imageFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  }
});

const TodoModal = mongoose.model("Todo", todoSchema);

export default TodoModal;
