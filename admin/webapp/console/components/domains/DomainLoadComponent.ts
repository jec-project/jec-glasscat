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
import {DomainsService} from "../../services/DomainsService";
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {Subscription} from "rxjs/Rx";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {ConfirmDialogMessageService} from '../../services/messaging/ConfirmDialogMessageService';
import {ContextService} from "../../services/ContextService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {SelectItem} from "primeng/components/common/api";
import {HttpListenerConfig, BootstrapConfig, Domain} from "jec-glasscat-core";

@Component({
  selector: "app-domains",
  templateUrl: "./templates/domains/domain-load.html"
})
export class DomainLoadComponent implements OnInit, OnDestroy {

  ////////////////////////////////////////////////////////////////////////////
  // Constructor function
  ////////////////////////////////////////////////////////////////////////////

  constructor(private _domainService:DomainsService,
              private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _messagingService:MessagingService,
              private _confirmDialogMessageService:ConfirmDialogMessageService,
              private _dialogMessageService:DialogMessageService,
              private _router:Router,
              private _route:ActivatedRoute,
              private _fb:FormBuilder){}

  ////////////////////////////////////////////////////////////////////////////
  // Public properties
  ////////////////////////////////////////////////////////////////////////////

  public domainName:string = null;
  public domainDirectory:string = null;

  public projectPropertiesForm:FormGroup = null;

  public domain:Domain = null;

  public serverList:SelectItem[] = null;

  ////////////////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////////////////

  public addDomain():void {
    if(this._domainUpdateSubscriber) this._domainUpdateSubscriber.unsubscribe();
    this._domainUpdateSubscriber = this._domainService.addDomain(this.domain).subscribe(
      data => {
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "Domain loaded")
        );
        this.closeForm();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Domain load error",
          "An error occured while loading the domain.<br/>You must restart the application."
        ));
        console.log(err);
      }
    );
  }

  public closeForm():void {
    this._router.navigate(['/domains']);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////////////////

  /**
   * @override
   */
  public ngOnInit():void {
    this.init();
    this._subscriber = this._route.params.subscribe(
      params => {
        this.domainDirectory = params["id"];
        this.initBreadcrumb();
        if(this.domainDirectory) {
          this._target = "${root}/workspace/" + this.domainDirectory;
          this.getContext();
        }
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Domain error",
          "Domain ID parameter is not valid."
        ));
        console.error(err);
      }
    );
  }

  public serverChangeHandler(event:any):void {
    const serverId:string = event.value;
    const newHost:string = this._hostMap.get(serverId);
    this.projectPropertiesForm.patchValue( { host: newHost });
    this.domain.connector.server = serverId;
    this.domain.host = newHost;
  }

  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
    if(this._domainUpdateSubscriber) this._domainUpdateSubscriber.unsubscribe();
  }

  private _target:string = null;
  private _subscriber:Subscription = null;
  private _contextSubscriber:Subscription = null;
  private _domainUpdateSubscriber:Subscription = null;

  private _context:BootstrapConfig = null;
  private _hostMap:Map<string, string> = null;

  private _projectPropertiesTarget:FormControl = null;
  private _projectPropertiesName:FormControl = null;
  private _projectPropertiesHost:FormControl = null;
  private _projectPropertiesServer:FormControl = null;
  private _projectPropertiesType:FormControl = null;
  
  private init():void {
    this._projectPropertiesTarget = new FormControl({disabled: true});
    this._projectPropertiesName = new FormControl({disabled: true}, Validators.required);
    this._projectPropertiesHost = new FormControl({disabled: true}, Validators.required);
    this._projectPropertiesServer = new FormControl("", Validators.required);
    this._projectPropertiesType = new FormControl({disabled: true}, Validators.required);
    this.projectPropertiesForm = this._fb.group({
      target: this._projectPropertiesTarget,
      name: this._projectPropertiesName,
      host: this._projectPropertiesHost,
      serverId: this._projectPropertiesServer,
      type: this._projectPropertiesType
    });
  }

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Domains", ['/domains']),
      ConsoleMenuItem.buildItem("Load"),
      ConsoleMenuItem.buildItem(this.domainDirectory, ['/' + this.domainDirectory])
    ]);
  }

  private loadDomain():void {
    this._domainService.loadDomain(this.domainDirectory).subscribe(
      data => {
        this.domain = data;
        const name:string = this.domain.name;
        this.domainName = name;
        this.domain.target = this._target;
        this.projectPropertiesForm.patchValue( { target: this._target});
        this.projectPropertiesForm.patchValue( { name: name });
        this.projectPropertiesForm.patchValue( { type: this.domain.connector.type });
        this.projectPropertiesForm.patchValue( { serverId: null });
        this.projectPropertiesForm.patchValue( { host: null });
        this._projectPropertiesTarget.disable();
        this._projectPropertiesName.disable();
        this._projectPropertiesHost.disable();
        this._projectPropertiesType.disable();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Domain initialization error",
          "An error occured while loading domain configuration.<br/>You must restart the application."
        ));
      }
    );
  }

  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        this.initServerList();
        this.loadDomain();
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

  private initServerList():void {
    const listeners:HttpListenerConfig[] = this._context.config.http.listeners;
    const list:SelectItem[] = new Array<SelectItem>();
    let listener:HttpListenerConfig = null;
    let len:number = listeners.length;
    this._hostMap = new Map<string, string>();
    let serverId:string = null;
    list.push({ label: "Select server", value: null });
    while(len--) {
      listener = listeners[len];
      serverId = listener.server;
      this._hostMap.set(serverId, listener.domain);
      list.push(
        { label: serverId, value: serverId }
      );
    }
    this.serverList = list;
  }
}