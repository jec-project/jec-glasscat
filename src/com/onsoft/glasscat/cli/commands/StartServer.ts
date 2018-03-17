//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2018 Pascal ECHEMANN.
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
        CommandDescriptor} from "jec-glasscat-cli";
import {GlassCat} from "../../GlassCat";

/**
 * The command that allows to create and start a new GlassCat server instance.
 */
export class StartServer extends AbstractScriptCommand
                         implements ScriptCommand {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new <code>StartServer</code> instance.
   */
  constructor() {
    super();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public functions
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public execute(argv:any, callback:(err:any)=>void):void {
    let container:GlassCat = null;
    try{
      container = new GlassCat();
      container.start();
      callback(null);
    } catch(err) {
      //console.log("StartServer Error:", err);
      callback(err);
    }
  }

  /**
   * @inheritDoc
   */
  public getHelp(argv:any):CommandDescriptor {
    const builder:CommandDescriptorBuilder = new CommandDescriptorBuilder();
    const descriptor:CommandDescriptor = builder.build(
      "$glasscat start-server",
      "Starts all services for a GlassCat Application Server."
    );
    return descriptor;
  }
}