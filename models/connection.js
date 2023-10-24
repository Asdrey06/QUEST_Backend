const mongoose = require("mongoose");

// const connectionString = "mongodb+srv://admin:MstD45atRUPQEBVd@cluster0.btn4jdj.mongodb.net/quest"
const connectionString =
  "mongodb+srv://admin:GCOdS5dnCKN5ez93@cluster1.giraqkl.mongodb.net/quest";
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
