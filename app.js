require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
//Middleware
const cors = require("cors");
const connectDB = require("./DB/Connect");

//Paths
const errorHandleMiddleware = require("./Middleware/errorHandleMiddleware");
const notFoundMidleware = require("./Middleware/notFoundMiddleware");

//Use thirt party Middlewre
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Auth Workflow");
});

//Error Handler
app.use(notFoundMidleware);
app.use(errorHandleMiddleware);

const startDB = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startDB();
