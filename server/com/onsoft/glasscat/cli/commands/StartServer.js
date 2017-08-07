"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const GlassCat_1 = require("../../GlassCat");
class StartServer extends jec_glasscat_cli_1.AbstractScriptCommand {
    constructor() {
        super();
    }
    execute(argv, callback) {
        let container = null;
        try {
            container = new GlassCat_1.GlassCat();
            container.start();
            callback(null);
        }
        catch (err) {
            callback(err);
        }
    }
    getHelp(argv) {
        let builder = new jec_glasscat_cli_1.CommandDescriptorBuilder();
        let descriptor = builder.build("$glasscat start-server", "Starts all services for a GlassCat Application Server.");
        return descriptor;
    }
}
exports.StartServer = StartServer;
