"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_core_1 = require("jec-glasscat-core");
const jec_commons_1 = require("jec-commons");
const fs = require("fs");
class FileLogger extends jec_commons_1.AbstractLogger {
    constructor() {
        super();
        this._formatter = null;
        this.FILE_PATH = './public/logs/logs.txt';
        this.init();
    }
    init() {
        this._formatter = new jec_glasscat_core_1.GlassCatLogFormatter();
        this.appendLog("\n=============================== GlassCat Rocks! ================================\n");
    }
    appendLog(message) {
        fs.appendFile(this.FILE_PATH, message, (err) => {
            if (err)
                throw err;
        });
    }
    debug(marker, context = "") {
        if (this.__logLevel <= jec_commons_1.LogLevel.DEBUG) {
            this.appendLog(this._formatter.format(jec_commons_1.LogLevelUtil.DEBUG, marker, true, context));
        }
    }
    error(marker, context = "") {
        if (this.__logLevel <= jec_commons_1.LogLevel.ERROR) {
            this.appendLog(this._formatter.format(jec_commons_1.LogLevelUtil.ERROR, marker, true, context));
        }
    }
    info(marker, context = "") {
        if (this.__logLevel <= jec_commons_1.LogLevel.INFO) {
            this.appendLog(this._formatter.format(jec_commons_1.LogLevelUtil.INFO, marker, true, context));
        }
    }
    trace(marker, context = "") {
        if (this.__logLevel <= jec_commons_1.LogLevel.TRACE) {
            this.appendLog(this._formatter.format(jec_commons_1.LogLevelUtil.TRACE, marker, true, context));
        }
    }
    warn(marker, context = "") {
        if (this.__logLevel <= jec_commons_1.LogLevel.WARN) {
            this.appendLog(this._formatter.format(jec_commons_1.LogLevelUtil.WARN, marker, true, context));
        }
    }
    toString() {
        return "[Logger::FileLogger]";
    }
}
exports.FileLogger = FileLogger;
;
