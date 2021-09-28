const mongoose = require("mongoose");
require("dotenv").config();

const { DATABASE_URL } = process.env;
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(`connecting to database in 5,4,3,2,1.........we are live in port ${process.env.PORT}!!!!`)
  )
  .catch(() => console.log("not connected"));

mongoose.connection.on("error", (err: any) => {
  console.log(`DB connection error: ${err.message}`);
});

module.exports = mongoose;
