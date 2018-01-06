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

import {LoggerFactory, LoggerContext, GlassCatLocaleManager} from "jec-glasscat-core";
import {GlassCatConsoleLogger} from "./GlassCatConsoleLogger";;
import {Logger, LogLevelUtil} from "jec-commons";

/**
 * The factory class for the GlassCat container logger that send outputs to the
 * console.
 */
export class ConsoleLoggerFactory implements LoggerFactory {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new <code>FileLoggerFactory</code> instance.
   */
  constructor() {}

  //////////////////////////////////////////////////////////////////////////////
  // Public methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public build(context:LoggerContext):Logger {
    let logger:Logger = new GlassCatConsoleLogger();
    logger.setName(context.name);
    if(context.logLevel !== null) {
      let llu:LogLevelUtil = new LogLevelUtil();
      GlassCatLocaleManager.getInstance().get(
        "warnings.invalidLogLevel",
        llu.logLevelToString(context.logLevel)
      )
    }
    return logger;
  }
};
