const mongoose = require("mongoose");
const URL = process.env.MONGO_URL;
const DB_connection = async () => {
  try {
    mongoose
      .connect(URL)
      .then(() => {
        console.log(
          `Database is successfully connect at ${mongoose.connection.host}`
        );
      })
      .catch((error) => {
        console.log(`Error in DB connection ${error}`);
      });
  } catch (error) {
    console.log(`Error in DB file ${error}`);
  }
};

module.exports = DB_connection;
