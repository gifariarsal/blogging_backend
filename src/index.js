const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");

const app = express();

app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${PORT}`);
})