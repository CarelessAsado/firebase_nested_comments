import mongoose, { Types, Document } from "mongoose";
export interface ITask extends Document {
  name: string;
  done: boolean;
  userID: Types.ObjectId;
}
const Task = new mongoose.Schema<ITask>(
  {
    name: { type: String, required: [true, "Task cannot be empty. "] },
    done: { type: Boolean, default: false },
    userID: {
      type: "ObjectID",
      ref: "User",
      required: [true, "Cannot upload task if user is not specified. "],
    },
  },
  { timestamps: true }
);
const taskModel = mongoose.model<ITask>("Task", Task);

export default taskModel;
