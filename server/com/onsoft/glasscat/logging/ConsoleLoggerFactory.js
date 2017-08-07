"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_core_1 = require("jec-glasscat-core");
const GlassCatConsoleLogger_1 = require("./GlassCatConsoleLogger");
;
const jec_commons_1 = require("jec-commons");
class ConsoleLoggerFactory {
    constructor() { }
    build(context) {
        let logger = new GlassCatConsoleLogger_1.GlassCatConsoleLogger();
        logger.setName(context.name);
        if (context.logLevel !== null) {
            let llu = new jec_commons_1.LogLevelUtil();
            jec_glasscat_core_1.LocaleManager.getInstance().get("warnings.invalidLogLevel", llu.logLevelToString(context.logLevel));
        }
        return logger;
    }
}
exports.ConsoleLoggerFactory = ConsoleLoggerFactory;
;
