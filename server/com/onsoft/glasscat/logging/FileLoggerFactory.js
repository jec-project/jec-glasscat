"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileLogger_1 = require("./FileLogger");
class FileLoggerFactory {
    constructor() { }
    build(context) {
        let logger = new FileLogger_1.FileLogger();
        logger.setName(context.name);
        logger.setLogLevel(context.logLevel);
        return logger;
    }
}
exports.FileLoggerFactory = FileLoggerFactory;
;
