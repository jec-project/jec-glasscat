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
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {EjpService} from "../../services/EjpService";
import {EjpConfig} from "jec-glasscat-config";
import {MessagingService} from "../../services/messaging/MessagingService";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";

export class AbstractEjpComponent implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute){}

  public ejpDirectory:string = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this._subscriber = this.__route.parent.params.subscribe(
      params => {
        this.ejpDirectory = params["id"];
        if(this.ejpDirectory) {
          this.initBreadcrumb();
          this.onParamsLoad();
          this.loadEjp();
        }
      },
      err => {
        this.__dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "EJP error",
          "EJP ID parameter is not valid."
        ));
        console.error(err);
      }
    );
  }

  public updateEjp():void {
    this._ejpUpdateSubscriber = this.__ejpService.updateEjp(this.__ejpModel).subscribe(
      (value:number) => {
        this.onEjpUpdate();
        this.__messagingService.push(
          ConsoleMessage.buildMessage("success", "EJP updated")
        );
      },
      (err:any) => {
        this.__dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "EJP update error",
          "An error occured while updating the EJP.<br/>You must restart the application."
        ));
        console.log(err);
      }
    );
  }
  
  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
  }

  public closeSubView():void {
    this.__router.navigate([this.PARENT_PATH], { relativeTo: this.__route });
  }
  
  public onEjpLoad():void {}

  public onEjpUpdate():void {}

  public onParamsLoad():void {}

  public readonly SLASH:string = "/";
  public readonly EMPTY_STRING:string = "";
  public readonly PARENT_PATH:string = "../";

  protected __ejpModel:EjpConfig = null;
  protected __paramLabel:string = null;
  protected __paramLink:string[] = null;

  private _subscriber:Subscription = null;
  private _ejpSubscriber:Subscription = null;
  private _ejpUpdateSubscriber:Subscription = null;
  
  protected initBreadcrumb():void {
    this.__breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", [this.SLASH]),
      ConsoleMenuItem.buildItem("EJPs"),
      ConsoleMenuItem.buildItem(this.ejpDirectory, [this.SLASH + this.ejpDirectory]),
      ConsoleMenuItem.buildItem(this.__paramLabel, this.__paramLink),
    ]);
  }

  private loadEjp():void {
    this._ejpSubscriber = this.__ejpService.get(this.ejpDirectory).subscribe(
      data => {
        this.__ejpModel = data;
        this.onEjpLoad();
      },
      err => {
        this.__dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "EJP initialization error",
          "An error occured while loading the manifest file.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }
}