require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
//Middleware
const cors = require("cors");
const connectDB = require("./DB/Connect");

//Paths
const errorHandleMiddleware = require("./Middleware/errorHandleMiddleware");
const notFoundMidleware = require("./Middleware/notFoundMiddleware");
const authRoutes = require("./Routes/authRoutes");
const userRoute = require("./Routes/userRoute");

//Use thirt party Middlewre
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Auth Workflow");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoute);

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
