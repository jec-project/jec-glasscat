"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const fs = require("fs");
const mkpath = require("mkpath");
const jec_commons_1 = require("jec-commons");
const jec_glasscat_core_1 = require("jec-glasscat-core");
class CreateRole extends jec_glasscat_cli_1.AbstractScriptCommand {
    constructor() {
        super();
    }
    createTemplate(className, role, glasscatPath) {
        let template = `import {BasicSecurityRole} from "${glasscatPath}server/com/onsoft/glasscat/security/roles/BasicSecurityRole";

/**
 * ${className} class.
 *
 * @class ${className}
 * @constructor
 * @extends BasicSecurityRole
 */
export class ${className} extends BasicSecurityRole {

  constructor() {
    super("${role}");
  }
}`;
        return template;
    }
    execute(argv, callback) {
        let project = argv.projectPath;
        let name = argv.name;
        let role = argv.role;
        let path = argv.path;
        let solver = null;
        let templatePaths = null;
        if (!project || project === jec_commons_1.UrlStringsEnum.EMPTY_STRING) {
            throw new SyntaxError("projectPath option is required");
        }
        if (!name || name === jec_commons_1.UrlStringsEnum.EMPTY_STRING) {
            throw new SyntaxError("name option is required");
        }
        if (!role || role === jec_commons_1.UrlStringsEnum.EMPTY_STRING) {
            throw new SyntaxError("role option is required");
        }
        solver = new jec_glasscat_core_1.TemplatePathsSolver();
        templatePaths =
            solver.resolve(name, jec_commons_1.JecStringsEnum.TS_EXTENSION, project, path);
        mkpath(templatePaths.directoryPath, (err) => {
            if (err)
                callback(err);
            else {
                fs.writeFile(templatePaths.filePath, this.createTemplate(name, role, templatePaths.relativePathPattern), callback);
            }
        });
    }
    getHelp(argv) {
        let commBuilder = new jec_glasscat_cli_1.CommandDescriptorBuilder();
        let paramBuilder = new jec_glasscat_cli_1.ParameterDescriptorBuilder();
        let parameters = new Array();
        parameters.push(paramBuilder.build("projectPath", "Represents the project directory for which to create the security role.", "string", true));
        parameters.push(paramBuilder.build("name", "The name of the security role to create.", "string", true));
        parameters.push(paramBuilder.build("path", "Represents the directory name, whithin the project, where to create the security role.", "string", true));
        parameters.push(paramBuilder.build("compile", "Indicate whether to compile the generated TypeScript file (true), or not (false).", "boolean"));
        let descriptor = commBuilder.build("$glasscat create-role", "Creates a new security role class for a GlassCat EJP.", parameters);
        return descriptor;
    }
}
exports.CreateRole = CreateRole;
