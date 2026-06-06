const dns = require("node:dns");
const mongoose = require("mongoose");

// Set DNS servers to resolve MongoDB Atlas SRV records correctly on Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
