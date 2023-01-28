const mongoose = require("mongoose");

const connectDB = (uri) => {
  mongoose.set("strictQuery", false);
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

module.exports = connectDB;
