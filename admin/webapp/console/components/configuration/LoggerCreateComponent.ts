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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {ContextService} from "../../services/ContextService";
import {Subscription} from "rxjs/Rx";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {LoggerFactoryConfig, BootstrapConfig} from "jec-glasscat-core";

@Component({
  selector: 'app-loggers',
  templateUrl: "./templates/configuration/logger-create.html",
})
export class LoggerCreateComponent implements OnInit, OnDestroy {

  ////////////////////////////////////////////////////////////////////////////
  // Constructor function
  ////////////////////////////////////////////////////////////////////////////

  constructor(private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _messagingService:MessagingService,
              private _dialogMessageService:DialogMessageService,
              private _fb:FormBuilder,
              private _router:Router){}

   ////////////////////////////////////////////////////////////////////////////
  // Public properties
  ////////////////////////////////////////////////////////////////////////////

  public newLoggerForm:FormGroup = null;

  public logLevelList:any[] = null;
  public selectedLogLevel:any = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.getContext();
    this.init();
  }

  public ngOnDestroy():void {
    this._contextSubscriber.unsubscribe();
    if(this._contextUpdateSubscriber) this._contextUpdateSubscriber.unsubscribe();
  }

  public resetForm():void {
    this.newLoggerForm.reset();
  }

  public closeForm():void {
    this._router.navigate(['/configuration/loggers']);
  }

  private _loggerName:FormControl = null;
  private _loggerFactory:FormControl = null;
  private _loggerLogLevel:FormControl = null;

  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("Loggers", ['/configuration/loggers']),
      ConsoleMenuItem.buildItem("Create", ['/configuration/loggers/create'])
    ]);
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

  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        let info:any = data.config.loggers;
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
  
  public saveContext():void {
    let logger:any = {};
    logger.name = this.newLoggerForm.get("name").value;
    logger.factory = this.newLoggerForm.get("factory").value;
    logger.logLevel = this.selectedLogLevel.value;
    this._context.config.loggers.factories.push(logger);
    this._contextUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "New logger added" )
        );
        this.closeForm();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Logger creation error",
          "An error occured while creating the new logger."
        ));
        console.error(err);
      }
    );
  }

  private init():void {
    this.initLogLevelList();
    this._loggerName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
    this._loggerFactory = new FormControl('', Validators.required);
    this._loggerLogLevel = new FormControl('');
    this.newLoggerForm = this._fb.group({
      "name": this._loggerName,
      "factory": this._loggerFactory,
      "logLevel": this._loggerLogLevel
    });
    this.selectedLogLevel = this.logLevelList[0];
  }
}