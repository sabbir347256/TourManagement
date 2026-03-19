import { Server } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { envVars } from "./app/config/env";
import app from "./app";
import { seedSuperAdmin } from "./app/utilis/seedSuperAdmin";

const port = process.env.PORT;
const db_url = envVars.DB_URL;
dotenv.config();

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("connected to database");
    server = app.listen(port, () => {
      console.log("server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();
