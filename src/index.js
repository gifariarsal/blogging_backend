const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { authRouter, blogRouter, profileRouter } = require("./routes");

app.use("/auth", authRouter);
// app.use("/blog", blogRouter);
// app.use("/profile", profileRouter);

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome home!" });
// });

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
})