const mongoose = require("mongoose");

// const connectionString = "mongodb+srv://admin:MstD45atRUPQEBVd@cluster0.btn4jdj.mongodb.net/quest"
const connectionString = process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
