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

import {LoggerManager, LoggerManagerBuilder, Kernel, EnvironmentValidator,
        ContextValidator, GlassCatLocaleManager } from "jec-glasscat-core";
import {JcadContextManager, DecoratorConnectorManager} from "jec-commons";

/**
 * Represents the entry point for a GlassCat container instance.
 */
export class GlassCat {

  //////////////////////////////////////////////////////////////////////////////
  // Constructor function
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Creates a new <code>GlassCat</code> instance.
   */
  constructor() { }

  //////////////////////////////////////////////////////////////////////////////
  // Private properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * The kernel for the current GlassCat container instance.
   */
  private _kernel:Kernel = null;

  //////////////////////////////////////////////////////////////////////////////
  // Private methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Initializes the container instance. This method is called by the
   * <code>start()</code> function.
   */
  private runProcesses():void {
    let initDate:number = Date.now();
    this.initKernel();
    this.initLogger();
    this.checkConfig();
    this.initServices();
    this.startServices();
    LoggerManager.getInstance().info(
      GlassCatLocaleManager.getInstance().get("server.ready")
    );
    LoggerManager.getInstance().info(
      GlassCatLocaleManager.getInstance().get(
        "server.startDuration", String(Date.now() - initDate)
      )
    );
  }

  /**
   * Kills all processes used by the container instance. This method is called
   * by the <code>stop()</code> function.
   */
  private killProcesses():void {
    this._kernel.stopServices();
    this._kernel = null;
    LoggerManager.getInstance().info(
      GlassCatLocaleManager.getInstance().get("server.stop")
    );
  }

  /**
   * Initializes the container kernel.
   */
  private initKernel():void {
    this._kernel = new Kernel();
    this._kernel.initContext();
  }

  /**
   * Initializes the logger for this container instance.
   */
  private initLogger():void {
    new LoggerManagerBuilder().context(this._kernel.getContext()).build();
  }

  /**
   * Checks the container context to detect errors.
   */
  private checkConfig():void {
    new ContextValidator().validate(this._kernel);
    new EnvironmentValidator().validate(this._kernel);
    LoggerManager.getInstance().info(
      GlassCatLocaleManager.getInstance().get(
        "singleton.info",
        "[JcadContextManager]",
        JcadContextManager.getInstance().getId()
      )
    );
    LoggerManager.getInstance().info(
      GlassCatLocaleManager.getInstance().get(
        "singleton.info",
        "[DecoratorConnectorManager]",
        DecoratorConnectorManager.getInstance().getId()
      )
    );
  }

  /**
   * Initializes all core services of the GlassCat container.
   */
  private initServices():void {
    this._kernel.initServices();
  }

  /**
   * Initializes the container services.
   */
  private startServices():void {
    this._kernel.startServices();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Starts the GlassCat container.
   */
  public start():void {
    this.runProcesses();
  }

  /**
   * Stops the GlassCat container.
   */
  public stop():void {
    this.killProcesses();
  }
};
