var express = require("express");
var router = express.Router();
const config = require("config");
const fs = require("fs");
const cors = require("cors");
const MBTiles = require("@mapbox/mbtiles");
const winston = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");

// config constants
const mbtilesDir = config.get("mbtilesDir");

// global variables
let mbtilesPool = {};
let busy = false;

var app = express();
app.use(cors());

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const loggingWinston = new LoggingWinston();
const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console(), loggingWinston],
});

//specify the target mbtiles from the path
const getMBTiles = async (t, z, x, y) => {
  let mbtilesPath = `${mbtilesDir}/${t}.mbtiles`;
  return new Promise((resolve, reject) => {
    if (mbtilesPool[mbtilesPath]) {
      resolve(mbtilesPool[mbtilesPath].mbtiles);
    } else {
      if (fs.existsSync(mbtilesPath)) {
        new MBTiles(`${mbtilesPath}?mode=ro`, (err, mbtiles) => {
          if (err) {
            reject(new Error(`${mbtilesPath} could not open.`));
          } else {
            mbtilesPool[mbtilesPath] = {
              mbtiles: mbtiles,
              openTime: new Date(),
            };
            resolve(mbtilesPool[mbtilesPath].mbtiles);
          }
        });
      } else {
        reject(new Error(`${mbtilesPath} was not found.`));
      }
    }
  });
};

//Get tile from mbtiles with z,x,y
const getTile = async (mbtiles, z, x, y) => {
  return new Promise((resolve, reject) => {
    mbtiles.getTile(z, x, y, (err, tile, headers) => {
      if (err) {
        reject();
      } else {
        resolve({ tile: tile, headers: headers });
      }
    });
  });
};

//GET Tile(router)- t,z,x,y are extracted from the path
router.get(`/zxy/:t/:z/:x/:y.pbf`, async function (req, res) {
  busy = true;
  const t = req.params.t;
  const z = parseInt(req.params.z);
  const x = parseInt(req.params.x);
  const y = parseInt(req.params.y);

  logger.info(`get tile ${t}, ${z}, ${x}, ${y}`);

  getMBTiles(t, z, x, y)
    .then((mbtiles) => {
      getTile(mbtiles, z, x, y)
        .then((r) => {
          if (r.tile) {
            res.set("content-type", "application/vnd.mapbox-vector-tile");
            res.set("content-encoding", "gzip");
            res.set("last-modified", r.headers["Last-Modified"]);
            res.set("etag", r.headers["ETag"]);
            res.send(r.tile);
            busy = false;
            logger.info("success");
          } else {
            res
              .status(404)
              .send(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`);
            busy = false;
            logger.error(`tile not found: /zxy/${t}/${z}/${x}/${y}.pbf`);
          }
        })
        .catch((e) => {
          res
            .status(404)
            .send(
              `tile not found (getTile error): /zxy/${t}/${z}/${x}/${y}.pbf`
            );
          busy = false;
          logger.error(
            `tile not found (getTile error): /zxy/${t}/${z}/${x}/${y}.pbf`
          );
        });
    })
    .catch((e) => {
      res
        .status(404)
        .send(`mbtiles not found for /zxy/${t}/${z}/${x}/${y}.pbf`);
      logger.error(`mbtiles not found for /zxy/${t}/${z}/${x}/${y}.pbf`);
    });
});

module.exports = router;
