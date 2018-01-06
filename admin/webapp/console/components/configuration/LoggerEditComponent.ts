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

import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from '@angular/router';
import {ContextService} from "../../services/ContextService";
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConfirmDialogMessageService} from '../../services/messaging/ConfirmDialogMessageService';
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {Subscription} from "rxjs/Rx";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {SelectItem} from "primeng/components/common/api";
import {LoggerFactoryConfig, BootstrapConfig} from "jec-glasscat-core";

@Component({
  selector: "app-loggers",
  templateUrl: "./templates/configuration/logger-edit.html"
})
export class LoggerEditComponent implements OnInit, OnDestroy {

  ////////////////////////////////////////////////////////////////////////////
  // Constructor function
  ////////////////////////////////////////////////////////////////////////////

  constructor(private _contextService:ContextService,
              private _breadcrumbService:BreadcrumbService,
              private _messagingService:MessagingService,
              private _confirmDialogMessageService:ConfirmDialogMessageService,
              private _dialogMessageService:DialogMessageService,
              private _router:Router,
              private _route:ActivatedRoute,
              private _fb:FormBuilder){}

  ////////////////////////////////////////////////////////////////////////////
  // Public properties
  ////////////////////////////////////////////////////////////////////////////

  public logLevelList:SelectItem[] = null;

  ////////////////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////////////////

  public deleteLogger():void {
    this._confirmDialogMessageService.push({
      message: "This operation cannot be undone. Would you like to proceed?",
      accept:() => {
        let factories:LoggerFactoryConfig[] =
                                         this._context.config.loggers.factories;
        let pos:number = factories.indexOf(this._logger);
        factories.splice(pos, 1);
        this.updateContext("Logger deleted");
      }
    });
  }

  public closeForm():void {
    this._router.navigate(['/configuration/loggers']);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Business public properties
  ////////////////////////////////////////////////////////////////////////////

  public loggerName:string = null;

  public loggerPropertiesForm:FormGroup = null;

  public _logger:LoggerFactoryConfig = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this.init();
    this._paramsSubscriber = this._route.params.subscribe(
      params => {
        this.loggerName = params["id"];
        this.initBreadcrumb();
        if(this.loggerName) this.getContext();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Logger error",
          "Logger ID parameter is not valid."
        ));
        console.error(err);
      }
    );
  }

  public ngOnDestroy():void {
    this._paramsSubscriber.unsubscribe();
    this._contextSubscriber.unsubscribe();
    if(this._contextUpdateSubscriber) this._contextUpdateSubscriber.unsubscribe();
  }

  public saveContext():void {
    this._logger.name = this.loggerPropertiesForm.get("name").value;
    this._logger.factory = this.loggerPropertiesForm.get("factory").value;
    this._logger.logLevel = this.loggerPropertiesForm.get("logLevel").value;
    this.updateContext("Logger changed");
  }

  private _paramsSubscriber:Subscription = null;
  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;

  private _context:BootstrapConfig = null;

  private _loggerPropertiesName:FormControl = null;
  private _loggerPropertiesFactory:FormControl = null;
  private _loggerPropertiesLogLevel:FormControl = null;
  
  private init():void {
    this.initLogLevelList();
    this._loggerPropertiesName = new FormControl("", Validators.required);
    this._loggerPropertiesFactory = new FormControl("", Validators.required);
    this._loggerPropertiesLogLevel = new FormControl("");
    this.loggerPropertiesForm = this._fb.group({
      name: this._loggerPropertiesName,
      factory: this._loggerPropertiesFactory,
      logLevel: this._loggerPropertiesLogLevel
    });
    
  }

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("Loggers", ['/configuration/loggers']),
      ConsoleMenuItem.buildItem("Edit"),
      ConsoleMenuItem.buildItem(this.loggerName, ['/' + this.loggerName])
    ]);
  }

  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        this._logger = this.getLogger();
        this.loggerPropertiesForm.patchValue( { name: this._logger.name });
        this.loggerPropertiesForm.patchValue( { factory: this._logger.factory });
        this.loggerPropertiesForm.patchValue( { logLevel: this._logger.logLevel }); 
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Context initialization error",
          "An error occured while loading configuration files.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }

  private getLogger():LoggerFactoryConfig {
    let logger:LoggerFactoryConfig = null;
    let rawLogger:LoggerFactoryConfig = null;
    let factories:LoggerFactoryConfig[] = this._context.config.loggers.factories;
    let len:number = -1;
    if(factories) {
      len = factories.length;
      while(len--) {
        rawLogger = factories[len];
        if(rawLogger.name === this.loggerName) {
          logger = rawLogger;
          break;
        }
      }
    }
    return logger;
  }

  private initLogLevelList():void {
    this.logLevelList = [
        { label:"none", value: undefined },
        { label:"TRACE", value: "TRACE" },
        { label:"DEBUG", value: "DEBUG" },
        { label:"INFO", value: "INFO" },
        { label:"WARN", value: "WARN" },
        { label:"ERROR", value: "ERROR" }
    ];
  }

  private updateContext(successMessage:string):void {
    this._contextUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", successMessage)
        );
        this.closeForm();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Logger update error",
          "An error occured while setting logger properties."
        ));
        console.error(err);
      }
    );
  }
}