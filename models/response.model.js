import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const ResponseSchema = new Schema(
  {
    opinion: String,
    question_id: {
      type: Types.ObjectId,
      ref: "Question",
    },
    user_id: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "responses",
    timestamps: true,
  }
);

const ResponseModel = mongoose.model("Response", ResponseSchema);

export default ResponseModel;
