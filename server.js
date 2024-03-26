require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

//connecting to mongo
connectDB();

//custom middleware logger
//all details that were here we taken to logevents at logger fxn
app.use(logger);

//handle options credentials check -before cors
//and fetch cookies credentials requirements

app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//in other words, form data;
//content-type: application /x-www-form-urlencoded

app.use(express.urlencoded({ extended: false }));

//middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT); //put here to verify the files below and ignore the ones above
app.use("/employees", require("./model/employees"));

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
