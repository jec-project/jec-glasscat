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

import {ScriptCommand, AbstractScriptCommand} from "jec-glasscat-cli";
import {Tiger, TigerFactory} from "jec-tiger";

/**
 * The command that allows to start GlassCat unit testing process.
 * 
 * @class RunUnitTests
 * @constructor
 * @extends AbstractScriptCommand
 * @implements ScriptCommand
 */
export class RunUnitTests extends AbstractScriptCommand
                         implements ScriptCommand {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

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
    let factory:TigerFactory = new TigerFactory();
    let tester:Tiger = factory.create();
    tester.process((err:any)=>{
      callback(err);
    });
  }
}