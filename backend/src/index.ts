import "reflect-metadata";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO_URI!)
  .then((_) => {
    console.log("Connected to db");
    app.listen(process.env.PORT! || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT! || 3000}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
