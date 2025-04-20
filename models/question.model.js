import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const QuestionSchema = new Schema(
  {
    question: String,
    subject_id: {
      type: Types.ObjectId,
      ref: "Subject",
    },
    user_id: {
      type: Types.ObjectId,
      ref: "User",
    },
    detail: String,
  },
  {
    collection: "questions",
    timestamps: true,
  }
);

const QuestionModel = mongoose.model("Question", QuestionSchema);

export default QuestionModel;
