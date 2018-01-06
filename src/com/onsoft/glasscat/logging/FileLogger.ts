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
import {LogLevelString, LogLevel, LogFormatter, AbstractLogger} from "jec-commons";
import * as fs from "fs";

/**
 * Creates a basic logger wich sends all log messages to a logs file.
 */
export class FileLogger extends AbstractLogger {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new <code>FileLogger</code> instance.
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

  /**
   * The path to the file used by this <code>Logger</code> object to log
   * messages.
   */
  private FILE_PATH:string = './public/logs/logs.txt';

  //////////////////////////////////////////////////////////////////////////////
  // Private methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Initializes this <code>Logger</code> object.
   *
   * @private
   */
  private init():void {
    this._formatter = new GlassCatLogFormatter();
    this.appendLog("\n=============================== GlassCat Rocks! ================================\n");
  }

  /**
   * Appends the specified log message to the logs file.
   */
  private appendLog(message:string):void {
    fs.appendFile(this.FILE_PATH, message, (err:NodeJS.ErrnoException) => {
      if(err) throw err;
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * @inheritDoc
   */
  public debug(marker:any, context:string = ""):void {
    if(this.__logLevel <= LogLevel.DEBUG) {
      this.appendLog(
        this._formatter.format(LogLevelString.DEBUG, marker, true, context)
      );
    }
  }

  /**
   * @inheritDoc
   */
  public error(marker:any, context:string = ""):void {
    if(this.__logLevel <= LogLevel.ERROR) {
      this.appendLog(
        this._formatter.format(LogLevelString.ERROR, marker, true, context)
      );
    }
  }

  /**
   * @inheritDoc
   */
  public info(marker:any, context:string = ""):void {
    if(this.__logLevel <= LogLevel.INFO) {
      this.appendLog(
        this._formatter.format(LogLevelString.INFO, marker, true, context)
      );
    }
  }

  /**
   * @inheritDoc
   */
  public trace(marker:any, context:string = ""):void {
    if(this.__logLevel <= LogLevel.TRACE) {
      this.appendLog(
        this._formatter.format(LogLevelString.TRACE, marker, true, context)
      );
    }
  }

  /**
   * @inheritDoc
   */
  public warn(marker:any, context:string = ""):void {
    if(this.__logLevel <= LogLevel.WARN) {
      this.appendLog(
        this._formatter.format(LogLevelString.WARN, marker, true, context)
      );
    }
  }

  /**
   * @inheritDoc
   */
  public toString():string {
    return "[Logger::FileLogger]";
  }
};
