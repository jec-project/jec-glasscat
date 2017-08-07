"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const jec_wildcat_1 = require("jec-wildcat");
class BuildArchetype extends jec_glasscat_cli_1.AbstractScriptCommand {
    constructor() {
        super();
    }
    buildProcessor() {
        jec_wildcat_1.WildcatLoggerProxy.getInstance().setLogger(this.__logger);
        let wildcatBuilder = new jec_wildcat_1.WildcatBuilder();
        let wildcat = wildcatBuilder.build();
        return wildcat;
    }
    buildRequest(argv) {
        let requestBuilder = new jec_wildcat_1.WildcatRequestBuilder();
        requestBuilder.gpm(argv.gpm);
        requestBuilder.projectName(argv.projectName);
        requestBuilder.contextRoot(argv.contextRoot);
        requestBuilder.directory(argv.directory);
        requestBuilder.properties(argv);
        return requestBuilder.build();
    }
    execute(argv, callback) {
        let wildcat = null;
        let request = null;
        try {
            wildcat = this.buildProcessor();
            request = this.buildRequest(argv);
            wildcat.execute(request, callback);
        }
        catch (err) {
            callback(err);
        }
    }
    getHelp(argv) {
        let commBuilder = new jec_glasscat_cli_1.CommandDescriptorBuilder();
        let paramBuilder = new jec_glasscat_cli_1.ParameterDescriptorBuilder();
        let parameters = new Array();
        parameters.push(paramBuilder.build("gpm", "The reference to the 'Glasscat Project Model' to use for creating the archetype.", "string", true));
        parameters.push(paramBuilder.build("projectName", "The name of the project created from the archetype.", "string", true));
        parameters.push(paramBuilder.build("directory", "The name of the target directory for the project created from the archetype.", "string", true));
        parameters.push(paramBuilder.build("contextRoot", "The context root of the project created from the archetype.", "string", true));
        let descriptor = commBuilder.build("$glasscat build-archetype", "Builds and deploies an EJP archetype from the 'public/wildcat/' repository, to the workspace.");
        return descriptor;
    }
}
exports.BuildArchetype = BuildArchetype;
