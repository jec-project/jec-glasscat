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

import {ScriptCommand, AbstractScriptCommand, CommandHelpFormatter, CommandDescriptorBuilder,
        CommandDescriptor, ParameterDescriptorBuilder, ParameterDescriptor} from "jec-glasscat-cli";
import * as fs from "fs";
import * as path from "path";
import * as mkpath from "mkpath";
import {JecStringsEnum, UrlStringsEnum} from "jec-commons";
import {TemplatePaths, TemplatePathsSolver} from "jec-glasscat-core";

/**
 * The command that allows to create a __BasicSecurityRole__ concrete
 * implementation for a GlassCat EJP.
 * 
 * @class CreateRole
 * @constructor
 * @extends AbstractScriptCommand
 * @implements ScriptCommand
 * @example
 * glasscat create-role --projectPath=myProject --name=MyClassName --role=ROLE
 * --path=myDirectory
 */
export class CreateRole extends AbstractScriptCommand implements ScriptCommand {

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
   * Returns the template for the __BasicSecurityRole__ class to create.
   * 
   * @method createTemplate
   * @param {string} className the class name for the __BasicSecurityRole__
   *                           class to create.
   * @param {string} glasscatPath the relative path to the GlassCat sources.
   * @return {string} the template for the __BasicSecurityRole__ class to create.
   */
  private createTemplate(className:string, role:string,
                                           glasscatPath:string):string {
    let template:string =
`import {BasicSecurityRole} from "${glasscatPath}server/com/onsoft/glasscat/security/roles/BasicSecurityRole";

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

  //////////////////////////////////////////////////////////////////////////////
  // Public functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public execute(argv:any, callback:(err:any)=>void):void {
    let project:string = argv.projectPath;
    let name:string = argv.name;
    let role:string = argv.role;
    let path:string = argv.path;
    let solver:TemplatePathsSolver = null;
    let templatePaths:TemplatePaths = null;
    if(!project || project === UrlStringsEnum.EMPTY_STRING) {
      throw new SyntaxError("projectPath option is required");
    }
    if(!name || name === UrlStringsEnum.EMPTY_STRING) {
      throw new SyntaxError("name option is required");
    }
    if(!role || role === UrlStringsEnum.EMPTY_STRING) {
      throw new SyntaxError("role option is required");
    }
    solver = new TemplatePathsSolver();
    templatePaths =
                  solver.resolve(name, JecStringsEnum.TS_EXTENSION, project, path);
    mkpath(templatePaths.directoryPath, (err:any)=> {
      if(err) callback(err);
      else {
        fs.writeFile(
          templatePaths.filePath,
          this.createTemplate(name, role, templatePaths.relativePathPattern),
          callback
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
        "Represents the project directory for which to create the security role.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "name",
        "The name of the security role to create.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "path",
        "Represents the directory name, whithin the project, where to create the security role.",
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
      "$glasscat create-role",
      "Creates a new security role class for a GlassCat EJP.",

      parameters
    );
    return descriptor;
  }
}