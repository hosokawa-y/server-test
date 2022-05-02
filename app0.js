const config = require("config");
// const fs = require('fs')
const express = require("express");
// const spdy = require('spdy') //for https
const cors = require("cors");

// config constants
const htdocsPath = config.get("htdocsPath");
// const privkeyPath = config.get('privkeyPath')
// const fullchainPath = config.get('fullchainPath')
const port = config.get("port");
// const mbtilesDir = config.get('mbtilesDir')

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

/* for https
spdy.createServer({
  key: fs.readFileSync(privkeyPath),
  cert: fs.readFileSync(fullchainPath)
}, app).listen(port)
*/
