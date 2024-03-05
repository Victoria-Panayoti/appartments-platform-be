const mongoose = require("mongoose");

const app = require("./index");
const { DB_HOST } = process.env;

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
