//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2017 Pascal ECHEMANN.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import {ScriptCommand, AbstractScriptCommand, CommandDescriptorBuilder, 
        CommandDescriptor, ParameterDescriptorBuilder, ParameterDescriptor} from "jec-glasscat-cli";
import * as fs from "fs";
import * as path from "path";
import * as mkpath from "mkpath";
import {TemplatePathsSolver, TemplatePaths} from "jec-glasscat-core";
import {JecStringsEnum, UrlStringsEnum} from "jec-commons";

/**
 * The command that allows to create a bootstrap file for a GlassCat EJP.
 * 
 * @class CreateBootstrapFile
 * @constructor
 * @extends AbstractScriptCommand
 * @implements ScriptCommand
 * @example
 * glasscat create-bootstrap-file --projectPath=myProject --name=MyClassName
 * --path=myDirectory --compile
 */
export class CreateBootstrapFile extends AbstractScriptCommand
                                 implements ScriptCommand {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  constructor() {
    super();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Private methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Returns the template for the bootstrap file to create.
   * 
   * @method createTemplate
   * @param {string} className the class name for the bootstrap file to create.
   * @param {string} glasscatPath the relative path to the GlassCat sources.
   * @return {string} the template for the bootstrap file to create.
   */
  private createTemplate(className:string, glasscatPath:string):string {
    let template:string =
`import {BootstrapScript} from "${glasscatPath}server/com/onsoft/glasscat/domains/scripts/BootstrapScript";
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

  /**
   * Returns the template for the compiled bootstrap file to create.
   * 
   * @method createCompiledTemplate
   * @param {string} className the class name for the bootstrap file to create.
   * @param {string} glasscatPath the relative path to the GlassCat sources.
   * @return {string} the template for the compiled bootstrap file to create.
   */
  private createCompiledTemplate(className:string, glasscatPath:string):string {
    let template:string =
`"use strict";
const BootstrapScript_1 = require("${glasscatPath}server/com/onsoft/glasscat/domains/scripts/BootstrapScript");
class ${className} extends BootstrapScript_1.BootstrapScript {
    run(container) {
    }
}
exports.${className} = ${className};`;
    return template;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public execute(argv:any, callback:(err:any)=>void):void {
    let project:string = argv.projectPath;
    let name:string = argv.name;
    let path:string = argv.path;
    let compile:boolean = (argv.compile !== null || argv.compile !== undefined);
    let solver:TemplatePathsSolver = null;
    let templatePaths:TemplatePaths = null;
    if(!project || project === UrlStringsEnum.EMPTY_STRING) {
      throw new SyntaxError("projectPath option is required");
    }
    if(!name || name === UrlStringsEnum.EMPTY_STRING) {
      throw new SyntaxError("name option is required");
    }
    solver = new TemplatePathsSolver();
    templatePaths = 
                  solver.resolve(name, JecStringsEnum.TS_EXTENSION, project, path);
    mkpath(templatePaths.directoryPath, (err:any)=> {
      if(err) callback(err);
      else {
        fs.writeFile(
          templatePaths.filePath,
          this.createTemplate(name, templatePaths.relativePathPattern),
          ()=> {
            if(compile) {
              templatePaths = solver.resolve(
                                  name, JecStringsEnum.JS_EXTENSION, project, path
                                );
              fs.writeFile(
                templatePaths.filePath,
                this.createCompiledTemplate(
                  name, templatePaths.relativePathPattern
                ),
                callback
              );
            } else callback(null);
          }
        );
      }
    });
  }

    /**
   * @inheritDoc
   */
  public getHelp(argv:any):any {
    let commBuilder:CommandDescriptorBuilder = new CommandDescriptorBuilder();
    let paramBuilder:ParameterDescriptorBuilder =
                                               new ParameterDescriptorBuilder();
    let parameters:ParameterDescriptor[] = new Array<ParameterDescriptor>();
    parameters.push(
      paramBuilder.build(
        "projectPath",
        "Represents the project directory for which to create the bootstrap file.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "name",
        "The name of the bootstrap file to create.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "path",
        "Represents the directory name, whithin the project, where to create the bootstrap file.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "compile",
        "Indicate whether to compile the generated TypeScript file (true), or not (false).",
        "boolean"
      )
    );
    let descriptor:CommandDescriptor = commBuilder.build(
      "$glasscat create-bootstrap-file",
      "Creates a new bootstrap file for a GlassCat EJP.",
      parameters
    );
    return descriptor;
  }
}