import { mongoose } from 'mongoose';

const { Schema, Types } = mongoose;
const NoteSchema = new Schema(
  {
    note: String,
    course_id: {
      type: Types.ObjectId,
      ref: "Course",
    },
    user_id: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "notes",
    timestamps: true,
  }
);

const NoteModel = mongoose.model("Note", NoteSchema);

export default NoteModel;
