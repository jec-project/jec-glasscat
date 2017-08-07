"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const fs = require("fs");
const mkpath = require("mkpath");
const jec_glasscat_core_1 = require("jec-glasscat-core");
const jec_commons_1 = require("jec-commons");
class CreateBootstrapFile extends jec_glasscat_cli_1.AbstractScriptCommand {
    constructor() {
        super();
    }
    createTemplate(className, glasscatPath) {
        let template = `import {BootstrapScript} from "${glasscatPath}server/com/onsoft/glasscat/domains/scripts/BootstrapScript";
import {DomainContainer} from "${glasscatPath}server/com/onsoft/glasscat/domains/containers/DomainContainer";

/**
 * ${className} class.
 *
 * @class ${className}
 * @constructor
 * @extends BootstrapScript
 */
export class ${className} extends BootstrapScript {

  /**
   * @inheritDoc
   */
  public run(container:DomainContainer):void {
    // TODO Auto-generated method stub
  }
}`;
        return template;
    }
    createCompiledTemplate(className, glasscatPath) {
        let template = `"use strict";
const BootstrapScript_1 = require("${glasscatPath}server/com/onsoft/glasscat/domains/scripts/BootstrapScript");
class ${className} extends BootstrapScript_1.BootstrapScript {
    run(container) {
    }
}
exports.${className} = ${className};`;
        return template;
    }
    execute(argv, callback) {
        let project = argv.projectPath;
        let name = argv.name;
        let path = argv.path;
        let compile = (argv.compile !== null || argv.compile !== undefined);
        let solver = null;
        let templatePaths = null;
        if (!project || project === jec_commons_1.UrlStringsEnum.EMPTY_STRING) {
            throw new SyntaxError("projectPath option is required");
        }
        if (!name || name === jec_commons_1.UrlStringsEnum.EMPTY_STRING) {
            throw new SyntaxError("name option is required");
        }
        solver = new jec_glasscat_core_1.TemplatePathsSolver();
        templatePaths =
            solver.resolve(name, jec_commons_1.JecStringsEnum.TS_EXTENSION, project, path);
        mkpath(templatePaths.directoryPath, (err) => {
            if (err)
                callback(err);
            else {
                fs.writeFile(templatePaths.filePath, this.createTemplate(name, templatePaths.relativePathPattern), () => {
                    if (compile) {
                        templatePaths = solver.resolve(name, jec_commons_1.JecStringsEnum.JS_EXTENSION, project, path);
                        fs.writeFile(templatePaths.filePath, this.createCompiledTemplate(name, templatePaths.relativePathPattern), callback);
                    }
                    else
                        callback(null);
                });
            }
        });
    }
    getHelp(argv) {
        let commBuilder = new jec_glasscat_cli_1.CommandDescriptorBuilder();
        let paramBuilder = new jec_glasscat_cli_1.ParameterDescriptorBuilder();
        let parameters = new Array();
        parameters.push(paramBuilder.build("projectPath", "Represents the project directory for which to create the bootstrap file.", "string", true));
        parameters.push(paramBuilder.build("name", "The name of the bootstrap file to create.", "string", true));
        parameters.push(paramBuilder.build("path", "Represents the directory name, whithin the project, where to create the bootstrap file.", "string", true));
        parameters.push(paramBuilder.build("compile", "Indicate whether to compile the generated TypeScript file (true), or not (false).", "boolean"));
        let descriptor = commBuilder.build("$glasscat create-bootstrap-file", "Creates a new bootstrap file for a GlassCat EJP.", parameters);
        return descriptor;
    }
}
exports.CreateBootstrapFile = CreateBootstrapFile;
