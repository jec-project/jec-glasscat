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

import {GlassCatLogFormatter} from "jec-glasscat-core";
import {LogLevel, LogLevelString, LogFormatter, AbstractLogger} from "jec-commons";

/**
 * Creates a basic logger wich sends all log messages to the console.
 */
export class GlassCatConsoleLogger extends AbstractLogger {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new <code>GlassCatConsoleLogger</code> instance.
   */
  constructor() {
    super();
    this.init();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Private properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * The log messages formatter for this <code>Logger</code> object.
   */
  private _formatter:LogFormatter = null;

  //////////////////////////////////////////////////////////////////////////////
  // Private methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Initializes this <code>Logger</code> object.
   */
  private init():void {
    this._formatter = new GlassCatLogFormatter();
    console.log("\n=============================== GlassCat Rocks! ================================\n");
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public debug(marker:any, context:string = ""):void {
    console.log(
      this._formatter.format(LogLevelString.DEBUG, marker, false, context)
    );
  }

  /**
   * @inheritDoc
   */
  public error(marker:any, context:string = ""):void {
    console.log(
      this._formatter.format(LogLevelString.ERROR, marker, false, context)
    );
  }

  /**
   * @inheritDoc
   */
  public info(marker:any, context:string = ""):void {
    console.log(
      this._formatter.format(LogLevelString.INFO, marker, false, context)
    );
  }

  /**
   * @inheritDoc
   */
  public trace(marker:any, context:string = ""):void {
    console.log(
      this._formatter.format(LogLevelString.TRACE, marker, false, context)
    );
  }

  /**
   * @inheritDoc
   */
  public warn(marker:any, context:string = ""):void {
    console.log(
      this._formatter.format(LogLevelString.WARN, marker, false, context)
    );
  }

  /**
   * @inheritDoc
   */
  public toString():string {
    return "[Logger::GlassCatConsoleLogger]";
  }
};
