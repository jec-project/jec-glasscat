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
import {BootstrapConfig, LoggerFactoryConfig} from "jec-glasscat-core";

@Component({
  selector: 'app-loggers',
  templateUrl: "./templates/configuration/httptask-create.html",
})
export class HttpTaskCreateComponent implements OnInit, OnDestroy {

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

  public newHttpTaskForm:FormGroup = null;

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
    this.newHttpTaskForm.reset();
  }

  public closeForm():void {
    this._router.navigate(['/configuration/httptasks']);
  }

  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("HTTP Tasks", ['/configuration/httptasks']),
      ConsoleMenuItem.buildItem("Create", ['/configuration/httptasks/create'])
    ]);
  }

  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
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
    let httpTask:any = { monitoring:{} };
    httpTask.id = this.newHttpTaskForm.get("name").value;
    httpTask.server = this.newHttpTaskForm.get("server").value;
    httpTask.address = this.newHttpTaskForm.get("address").value;
    httpTask.domain = this.newHttpTaskForm.get("domain").value;
    httpTask.port = this.newHttpTaskForm.get("port").value;
    httpTask.secured = this.newHttpTaskForm.get("secured").value;
    httpTask.sslPath = this.newHttpTaskForm.get("sslPath").value;
    httpTask.monitoring.enabled = this.newHttpTaskForm.get("monitoring").value;
    httpTask.monitoring.factory = this.newHttpTaskForm.get("monitorFactory").value;
    this._context.config.http.listeners.push(httpTask);
    this._contextUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "New HTTP task added" )
        );
        this.closeForm();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "HTTP task creation error",
          "An error occured while creating the new HTTP task."
        ));
        console.error(err);
      }
    );
  }

  private _httpTaskName:FormControl = null;
  private _httpTaskServer:FormControl = null;
  private _httpTaskAddress:FormControl = null;
  private _httpTaskDomain:FormControl = null;
  private _httpTaskPort:FormControl = null;
  private _httpTaskSecured:FormControl = null;
  private _httpTaskSslPath:FormControl = null;
  private _httpTaskMonitoring:FormControl = null;
  private _httpTaskMonitorFactory:FormControl = null;

  private init():void {
    this._httpTaskName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));
    this._httpTaskServer = new FormControl('', Validators.required);
    this._httpTaskAddress = new FormControl('', Validators.required);
    this._httpTaskPort = new FormControl('', Validators.required);
    this._httpTaskSecured = new FormControl('');
    this._httpTaskSslPath = new FormControl('');
    this._httpTaskMonitoring = new FormControl('');
    this._httpTaskMonitorFactory = new FormControl('');
    this.newHttpTaskForm = this._fb.group({
      "name": this._httpTaskName,
      "server": this._httpTaskServer,
      "address": this._httpTaskAddress,
      "domain": this._httpTaskDomain,
      "port": this._httpTaskPort,
      "secured": this._httpTaskSecured,
      "sslPath": this._httpTaskSslPath,
      "monitoring": this._httpTaskMonitoring,
      "monitorFactory": this._httpTaskMonitorFactory
    });
    this.newHttpTaskForm.patchValue( { address: "127.0.0.1" });
    this.newHttpTaskForm.patchValue( { domain: "localhost" });
  }
}