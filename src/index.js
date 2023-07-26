const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const db = require("./models");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT;

const { authRouter, blogRouter, categoryRouter, countryRouter, profileRouter } = require("./routes");

app.use("/api", authRouter, blogRouter, categoryRouter, countryRouter, profileRouter);
app.use("/", express.static(path.resolve(__dirname, "../")));

// db.sequelize.sync({ alter: true });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to blog!" });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})