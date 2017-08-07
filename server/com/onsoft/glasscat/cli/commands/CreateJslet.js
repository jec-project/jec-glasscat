"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jec_glasscat_cli_1 = require("jec-glasscat-cli");
const fs = require("fs");
const mkpath = require("mkpath");
const jec_glasscat_core_1 = require("jec-glasscat-core");
const jec_commons_1 = require("jec-commons");
class CreateJslet extends jec_glasscat_cli_1.AbstractScriptCommand {
    constructor() {
        super();
    }
    createTemplate(className, glasscatPath) {
        let template = `import {HttpJslet} from "${glasscatPath}server/com/jec/commons/jslet/HttpJslet";
import {server/com/jec/commons/jslet/annotations/WebJslet} from "${glasscatPath}server/com/jec/commons/jslet/annotations/WebJslet";
import {HttpRequest} from "${glasscatPath}server/com/jec/commons/jslet/net/http/HttpRequest";
import {HttpResponse} from "${glasscatPath}server/com/jec/commons/jslet/net/http/HttpResponse";

/**
 * ${className} class.
 *
 * @class ${className}
 * @constructor
 * @extends HttpJslet
 */
@WebJslet({
  name: "${className}",
  urlPatterns: ["/hello"]
})
export class ${className} extends HttpJslet {
  
  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    // TODO Auto-generated method stub
    exit(req, res.send("Hello World!"), null);
  }
}`;
        return template;
    }
    createCompiledTemplate(className, glasscatPath) {
        let template = `"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const HttpJslet_1 = require("${glasscatPath}server/com/jec/commons/jslet/HttpJslet");
const WebJslet_1 = require("${glasscatPath}server/com/jec/commons/jslet/annotations/WebJslet");
let ${className} = class ${className} extends HttpJslet_1.HttpJslet {
    doGet(req, res, exit) {
        exit(req, res.send("Hello World!"), null);
    }
};
${className} = __decorate([
    WebJslet_1.WebJslet({
        name: "${className}",
        urlPatterns: ["/hello"]
    })
], ${className});
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
        parameters.push(paramBuilder.build("projectPath", "Represents the project directory for which to create the jslet file.", "string", true));
        parameters.push(paramBuilder.build("name", "The name of the jslet file to create.", "string", true));
        parameters.push(paramBuilder.build("path", "Represents the directory name, whithin the project, where to create the jslet file.", "string", true));
        parameters.push(paramBuilder.build("compile", "Indicate whether to compile the generated TypeScript file (true), or not (false).", "boolean"));
        let descriptor = commBuilder.build("$glasscat create-jslet", "Creates a new jslet file for a GlassCat EJP.", parameters);
        return descriptor;
    }
}
exports.CreateJslet = CreateJslet;
