import mongoose, { Types, Document } from "mongoose";
export interface IDirectory extends Document {
  value: string;
  userID: Types.ObjectId;
  likes: Types.ObjectId[];
  parentID: Types.ObjectId;
}
const Comment = new mongoose.Schema<IDirectory>(
  {
    value: { type: String, required: [true, "Comment cannot be empty. "] },

    //parentID
    parentID: {
      type: "ObjectID",
      ref: "Comment",
      default: null,
    },

    userID: {
      type: "ObjectID",
      ref: "User",
      required: [true, "Cannot upload task if user is not specified. "],
    },
    likes: {
      type: [Types.ObjectId],
      ref: "User",
      //agregar un pre p/q el user no puede likear 2 veces
    },
  },
  { timestamps: true }
);
const commentModel = mongoose.model<IDirectory>("Comment", Comment);

export default commentModel;
