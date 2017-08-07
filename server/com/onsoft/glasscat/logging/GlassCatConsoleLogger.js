"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_core_1 = require("jec-glasscat-core");
const jec_commons_1 = require("jec-commons");
class GlassCatConsoleLogger extends jec_commons_1.AbstractLogger {
    constructor() {
        super();
        this._formatter = null;
        this.init();
    }
    init() {
        this._formatter = new jec_glasscat_core_1.GlassCatLogFormatter();
        console.log("\n=============================== GlassCat Rocks! ================================\n");
    }
    debug(marker, context = "") {
        console.log(this._formatter.format(jec_commons_1.LogLevelUtil.DEBUG, marker, false, context));
    }
    error(marker, context = "") {
        console.log(this._formatter.format(jec_commons_1.LogLevelUtil.ERROR, marker, false, context));
    }
    info(marker, context = "") {
        console.log(this._formatter.format(jec_commons_1.LogLevelUtil.INFO, marker, false, context));
    }
    trace(marker, context = "") {
        console.log(this._formatter.format(jec_commons_1.LogLevelUtil.TRACE, marker, false, context));
    }
    warn(marker, context = "") {
        console.log(this._formatter.format(jec_commons_1.LogLevelUtil.WARN, marker, false, context));
    }
    toString() {
        return "[Logger::GlassCatConsoleLogger]";
    }
}
exports.GlassCatConsoleLogger = GlassCatConsoleLogger;
;
