const config = require("config");
const express = require("express");
const cors = require("cors");

// config constants
const htdocsPath = config.get("htdocsPath");
const port = config.get("port");

// app
const app = express();
var VTRouter = require("./routes/VT");
app.use(cors());
app.use(express.static(htdocsPath));
app.use("/VT", VTRouter);

//for http
app.listen(port, () => {
  console.log(`Running at Port ${port} ...`);
});
