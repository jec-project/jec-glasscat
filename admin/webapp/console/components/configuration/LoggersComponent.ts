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
import {SelectItem} from "primeng/components/common/api";
import {LoggerFactoryConfig, BootstrapConfig} from "jec-glasscat-core";

@Component({
  selector: 'app-loggers',
  templateUrl: "./templates/configuration/loggers.html",
})
export class LoggersComponent implements OnInit, OnDestroy {

  ////////////////////////////////////////////////////////////////////////////
  // Constructor function
  ////////////////////////////////////////////////////////////////////////////

  constructor(private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _messagingService:MessagingService,
              private _router:Router,
              private _dialogMessageService:DialogMessageService){}

   ////////////////////////////////////////////////////////////////////////////
  // Public properties
  ////////////////////////////////////////////////////////////////////////////

  public editLogLevelInactive:boolean = true;

  public loggerListModel:LoggerFactoryConfig[] = null;
  public logLevel:string = null;
  public logLevelList:SelectItem[] = null;
  public selectedLogLevel:string = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.initLogLevelList();
    this.getContext();
  }

  public ngOnDestroy():void {
    this._contextSubscriber.unsubscribe();
    if(this._logLevelUpdateSubscriber)
       this._logLevelUpdateSubscriber.unsubscribe();
  }

  public toggleLogLevelEditionMode():void {
    this.editLogLevelInactive = !this.editLogLevelInactive;
  }

  public openCreateView():void {
    this._router.navigate(['/configuration/loggers/create']);
  }

  public itemSelect(item:any):void {
    this._router.navigate(['/configuration/loggers/edit', item.name]);
  }
  
  public saveContext():void {
    this._context.config.loggers.logLevel = this.selectedLogLevel;
    this._logLevelUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._logLevelUpdateSubscriber.unsubscribe();
        this._context = data;
        this.logLevel = this._context.config.loggers.logLevel;
        this.editLogLevelInactive = !this.editLogLevelInactive;
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "Log level changed" )
        );
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Log level update error",
          "An error occured while setting global log level."
        ));
        console.error(err);
      }
    );
  }

  private _contextSubscriber:Subscription = null;
  private _logLevelUpdateSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("Loggers", ['/configuration/loggers'])
    ]);
  }

  private initLogLevelList():void {
    this.logLevelList = [
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
        this.logLevel = info.logLevel;
        this.selectedLogLevel = this.logLevel;
        this.loggerListModel = info.factories;
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
}