
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;
var expressWinston = require('express-winston');
// var util = require('util');
// var type = process.env.NODE_ENV;
var fs = require('fs');
let mb5 = 1048576 * 5
let dir = "./logs"
let errorFilename = dir + "/error.log"
let infoFilename = dir + "/info.log"
let exceptionFilename = dir + "/exceptions.log"
let transportsList = [];
let serviceName = "lead";

/*const levels = { 
 error: 0, 
 warn: 1, 
 info: 2, 
 verbose: 3, 
 debug: 4, 
 silly: 5 
 };*/

//-- CREATE FOLDER IF NOT EXIST
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

var errorTransport = new transports.File({
    filename: errorFilename,
    name: 'file.error',
    level: 'error',
    maxsize: mb5,
    maxFiles: 10,
    handleExceptions: true,
    // json: false
})

var infoTransport = new transports.File({
    filename: infoFilename,
    name: 'file.info',
    level: 'info',
    maxsize: mb5,
    maxFiles: 10,
    handleExceptions: true,
    // json: false
})
transportsList.push(infoTransport)
transportsList.push(errorTransport)
if (['local', 'beta'].indexOf(process.env.NODE_ENV) == -1) {
    transportsList.push(new transports.Console());
    console.log = function () { }
}

const logger = createLogger({
    format: combine(
        timestamp(), json(),
    ),
    transports: transportsList,
    exceptionHandlers: [
        new transports.File({ filename: exceptionFilename })
    ],
    defaultMeta: { service: serviceName },
    exitOnError: false
});

const res_logger = expressWinston.logger({
    transports: transportsList,
    format: combine(
        timestamp(), json()
    ),
    dynamicMeta: () => ({ service: serviceName }),
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    ignoredRoutes: ["/health", "/metrics"],
    //   ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
})

logger.error('Created log files!++', { 'foo': 'bar' });
logger.info('Created log files!===', { 'foo': 'bar' });

module.exports.res_logger = res_logger;
module.exports.logger = logger;