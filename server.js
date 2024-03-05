const mongoose = require("mongoose");

const app = require("./index");

// SHSbrUzf2r0nPU6p
const DB_HOST =
  "mongodb+srv://Victoria:SHSbrUzf2r0nPU6p@cluster0.nmx2dck.mongodb.net/appartments_platform?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connect success");
    app.listen(8080, () => {
      console.log("Server running at http://localhost:8080");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
