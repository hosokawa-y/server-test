const config = require('config')
// const fs = require('fs')
const express = require('express')
// const spdy = require('spdy') //for https
const cors = require('cors') 
const winston = require('winston')
const {LoggingWinston} = require('@google-cloud/logging-winston')
const { Logging } = require('@google-cloud/logging')

// const DailyRotateFile = require('winston-daily-rotate-file')

// config constants
const htdocsPath = config.get('htdocsPath')
// const privkeyPath = config.get('privkeyPath')
// const fullchainPath = config.get('fullchainPath')
const port = config.get('port') 
// const mbtilesDir = config.get('mbtilesDir')


// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const loggingWinston = new LoggingWinston()
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        loggingWinston,
    ],
})

// app
const app = express()
app.use(cors())
app.use(express.static(htdocsPath))

//for http
app.listen(port, () => {
    console.log(`Running at Port ${port} ...`)
})

/* for https
spdy.createServer({
  key: fs.readFileSync(privkeyPath),
  cert: fs.readFileSync(fullchainPath)
}, app).listen(port)
*/