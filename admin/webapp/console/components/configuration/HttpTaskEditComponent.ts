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
import {HttpListenerConfig, BootstrapConfig} from "jec-glasscat-core";

@Component({
  selector: "app-loggers",
  templateUrl: "./templates/configuration/httptask-edit.html"
})
export class HttpTaskEditComponent implements OnInit, OnDestroy {

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

  ////////////////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////////////////

  public deleteLogger():void {
    this._confirmDialogMessageService.push({
      message: "This operation cannot be undone. Would you like to proceed?",
      accept:() => {
        let listeners:HttpListenerConfig[] =
                                            this._context.config.http.listeners;
        let pos:number = listeners.indexOf(this._listener);
        listeners.splice(pos, 1);
        this.updateContext("HTTP Task deleted");
      }
    });
  }

  public closeForm():void {
    this._router.navigate(['/configuration/httptasks']);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Business public properties
  ////////////////////////////////////////////////////////////////////////////

  public listenerName:string = null;

  public listenerPropertiesForm:FormGroup = null;

  public _listener:HttpListenerConfig = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this.init();
    this._paramsSubscriber = this._route.params.subscribe(
      params => {
        this.listenerName = params["id"];
        this.initBreadcrumb();
        if(this.listenerName) this.getContext();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "HTTP task error",
          "HTTP task ID parameter is not valid."
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
    this._listener.id = this.listenerPropertiesForm.get("name").value;
    this._listener.server = this.listenerPropertiesForm.get("server").value;
    this._listener.address = this.listenerPropertiesForm.get("address").value;
    this._listener.domain = this.listenerPropertiesForm.get("domain").value;
    this._listener.port = this.listenerPropertiesForm.get("port").value;
    this._listener.secured = this.listenerPropertiesForm.get("secured").value;
    this._listener.sslPath = this.listenerPropertiesForm.get("sslPath").value;
    this._listener.monitoring.enabled = this.listenerPropertiesForm.get("monitoring").value;
    this._listener.monitoring.factory = this.listenerPropertiesForm.get("monitorFactory").value;
    this.updateContext("HTTP Task changed");
  }

  private _paramsSubscriber:Subscription = null;
  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;

  private _context:BootstrapConfig = null;

  private _listenerPropertiesId:FormControl = null;
  private _listenerPropertiesServer:FormControl = null;
  private _listenerPropertiesAddress:FormControl = null;
  private _listenerPropertiesDomain:FormControl = null;
  private _listenerPropertiesPort:FormControl = null;
  private _listenerPropertiesSslPath:FormControl = null;
  private _listenerPropertiesSecured:FormControl = null;
  private _listenerPropertiesMonitoring:FormControl = null;
  private _listenerPropertiesMonitorFactory:FormControl = null;
  
  private init():void {
    this._listenerPropertiesId = new FormControl("", Validators.required);
    this._listenerPropertiesServer = new FormControl("", Validators.required)
    this._listenerPropertiesAddress = new FormControl("", Validators.required);
    this._listenerPropertiesDomain = new FormControl("", Validators.required);
    this._listenerPropertiesPort = new FormControl("", Validators.required);
    this._listenerPropertiesSslPath = new FormControl("");
    this._listenerPropertiesSecured = new FormControl("");
    this._listenerPropertiesMonitoring = new FormControl("");
    this._listenerPropertiesMonitorFactory = new FormControl("");
    this.listenerPropertiesForm = this._fb.group({
      name: this._listenerPropertiesId,
      server: this._listenerPropertiesServer,
      address: this._listenerPropertiesAddress,
      domain: this._listenerPropertiesDomain,
      port: this._listenerPropertiesPort,
      sslPath: this._listenerPropertiesSslPath,
      secured: this._listenerPropertiesSecured,
      monitoring: this._listenerPropertiesMonitoring,
      monitorFactory: this._listenerPropertiesMonitorFactory
    });
  }

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("HTTP Tasks", ['/configuration/httptasks']),
      ConsoleMenuItem.buildItem("Edit"),
      ConsoleMenuItem.buildItem(this.listenerName, ['/' + this.listenerName])
    ]);
  }

  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        this._listener = this.getListener();
        this.listenerPropertiesForm.patchValue( { name: this._listener.id });
        this.listenerPropertiesForm.patchValue( { server: this._listener.server });
        this.listenerPropertiesForm.patchValue( { address: this._listener.address });
        this.listenerPropertiesForm.patchValue( { domain: this._listener.domain });
        this.listenerPropertiesForm.patchValue( { port: this._listener.port });
        this.listenerPropertiesForm.patchValue( { sslPath: this._listener.sslPath });
        this.listenerPropertiesForm.patchValue( { secured: this._listener.secured });
        this.listenerPropertiesForm.patchValue( { monitoring: this._listener.monitoring.enabled });
        this.listenerPropertiesForm.patchValue( { monitorFactory: this._listener.monitoring.factory });
        this._listenerPropertiesId.disable();
        this._listenerPropertiesServer.disable();
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

  private getListener():HttpListenerConfig {
    let listener:HttpListenerConfig = null;
    let rawListener:HttpListenerConfig = null;
    let listeners:HttpListenerConfig[] = this._context.config.http.listeners;
    let len:number = -1;
    if(listeners) {
      len = listeners.length;
      while(len--) {
        rawListener = listeners[len];
        if(rawListener.id === this.listenerName) {
          listener = rawListener;
          break;
        }
      }
    }
    return listener;
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
          "error", "HTTP task update error",
          "An error occured while setting HTTP task properties."
        ));
        console.error(err);
      }
    );
  }
}