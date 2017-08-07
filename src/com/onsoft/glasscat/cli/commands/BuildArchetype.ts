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
import {Wildcat, WildcatBuilder, WildcatRequestBuilder, WildcatRequest,
        WildcatLoggerProxy} from "jec-wildcat";
import {LoggerManager} from "jec-glasscat-core";
import {Logger} from "jec-commons";

/**
 * The command that allows to build GlassCat projects form Wildcat archetypes.
 * 
 * @class BuildArchetype
 * @constructor
 * @extends AbstractScriptCommand
 * @implements ScriptCommand
 * @example
 * glasscat build-archetype --gpm=basic --projectName=myProject
 * --directory=myDirectory --contextRoot=myContextRoot
 */
export class BuildArchetype extends AbstractScriptCommand
                            implements ScriptCommand {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  constructor() {
    super();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Private functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Builds and returns a new __Wildcat__ instance.
   * 
   * @method buildProcessor
   * @return {Wildcat} a new __Wildcat__ instance.
   */
  private buildProcessor():Wildcat {
    WildcatLoggerProxy.getInstance().setLogger(this.__logger);
    let wildcatBuilder:WildcatBuilder = new WildcatBuilder();
    let wildcat:Wildcat = wildcatBuilder.build();
    return wildcat;
  }

  /**
   * Builds and returns a new __WildcatRequest__ instance.
   * 
   * @method buildRequest
   * @param {Object} argv the properties used for generating the request.
   * @return {WildcatRequest} a new __WildcatRequest__ instance.
   */
  private buildRequest(argv:any):WildcatRequest {
    let requestBuilder:WildcatRequestBuilder = new WildcatRequestBuilder();
    requestBuilder.gpm(argv.gpm);
    requestBuilder.projectName(argv.projectName);
    requestBuilder.contextRoot(argv.contextRoot);
    requestBuilder.directory(argv.directory);
    requestBuilder.properties(argv);
    return requestBuilder.build();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public execute(argv:any, callback:(err:any)=>void):void {
    let wildcat:Wildcat = null;
    let request:WildcatRequest = null;
    try{
      wildcat = this.buildProcessor();
      request = this.buildRequest(argv);
      wildcat.execute(request, callback);
    } catch(err) {
      callback(err);
    }
  }

  /**
   * @inheritDoc
   */
  public getHelp(argv:any):CommandDescriptor {
    let commBuilder:CommandDescriptorBuilder = new CommandDescriptorBuilder();
    let paramBuilder:ParameterDescriptorBuilder =
                                               new ParameterDescriptorBuilder();
    let parameters:ParameterDescriptor[] = new Array<ParameterDescriptor>();
    parameters.push(
      paramBuilder.build(
        "gpm",
        "The reference to the 'Glasscat Project Model' to use for creating the archetype.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "projectName",
        "The name of the project created from the archetype.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "directory",
        "The name of the target directory for the project created from the archetype.",
        "string",
        true
      )
    );
    parameters.push(
      paramBuilder.build(
        "contextRoot",
        "The context root of the project created from the archetype.",
        "string",
        true
      )
    );
    let descriptor:CommandDescriptor = commBuilder.build(
      "$glasscat build-archetype",
      "Builds and deploies an EJP archetype from the 'public/wildcat/' repository, to the workspace."
    );
    return descriptor;
  }
}