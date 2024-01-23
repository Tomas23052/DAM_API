require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes/rotas");

const app = express();

app.use(express.json());
app.use(routes);

app.listen(8081, () => {
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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
