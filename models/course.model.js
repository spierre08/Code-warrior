import mongoose from 'mongoose';

const { Schema, Types } = mongoose;
const CourseSchema = new Schema(
  {
    title: String,
    during: String,
    level: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Avancé"],
      default: "Débutant",
    },
    subject_id: {
      type: Types.ObjectId,
      ref: "Subject",
    },
    url: String,
    file_type: {
      type: String,
      enum: ["document", "vidéo"],
      default: "document",
    },
    description: String,
    author_id: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    collection: "courses",
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Course", CourseSchema);

export default CourseModel;
