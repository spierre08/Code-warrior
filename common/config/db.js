import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export default mongoose
  .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
  .then(() => {
    console.log("Connexion à la base de données MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
