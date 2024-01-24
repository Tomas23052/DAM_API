require("dotenv").config();

const port = process.env.PORT || 3000;

const mongoString = process.env.DATABASE_URL;

const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes/rotas");

const app = express();

app.use(express.json());
app.use(routes);

app.listen(port, "0.0.0.0", () => {
  console.log("Server is running");
});

mongoose.connect(mongoString);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database connected");
});

