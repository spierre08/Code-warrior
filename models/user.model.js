import mongoose from "mongoose";

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    full_name: String,
    email: String,
    password: String,
    type_user: {
      type: String,
      enum: ["étudiant", "professeur", "admin"],
      default: "étudiant",
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
