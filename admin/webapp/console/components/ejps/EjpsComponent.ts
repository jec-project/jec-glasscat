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

import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {MenuItem} from "primeng/components/common/api";

@Component({
  selector: "app-ejps",
  templateUrl: "./templates/ejps/ejps.html"
})
export class EjpsComponent implements OnInit, OnDestroy {

  constructor(private _dialogMessageService:DialogMessageService,
              private _router:Router,
              private _route:ActivatedRoute){}

  public ejpDirectory:string = null;
  public ejpMenuModel:MenuItem[] = null;
  public ejpActiveItem:MenuItem = null;

  /**
   * @override
   */
  public ngOnInit():void {
    this._subscriber = this._route.params.subscribe(
      params => {
        this.ejpDirectory = params["id"];
        this.initMenu();
        this.initRouteMap();
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "EJP error",
          "EJP ID parameter is not valid."
        ));
        console.error(err);
      }
    );
    this._routerSubscriber = this._router.events.subscribe(
      (val) => {
        if(this.ejpActiveItem === null && val instanceof NavigationEnd) {
          let currRoute:string = val.urlAfterRedirects;
          currRoute = currRoute.substring(currRoute.lastIndexOf(this.SLASH) + 1);
          this.ejpActiveItem = this._routemap.get(currRoute);
          this._routerSubscriber.unsubscribe();
        }
      }
    );
  }

  public closeForm():void {
    this._router.navigate(['/domains']);
  }

  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
    if(this._routerSubscriber) this._routerSubscriber.unsubscribe();
  }

  private _subscriber:Subscription = null;
  private _routerSubscriber:Subscription = null;
  private readonly EJP_PATH:string = "./ejps/";
  private readonly SLASH:string = "/";

  private _routemap:Map<string, MenuItem> = null;

  private initRouteMap():void {
    this._routemap = new Map<string, MenuItem>();
    this._routemap.set("general", this.ejpMenuModel[0]);
    this._routemap.set("context", this.ejpMenuModel[1]);
    this._routemap.set("jslets", this.ejpMenuModel[2]);
    this._routemap.set("filters", this.ejpMenuModel[3]);
    this._routemap.set("security", this.ejpMenuModel[4]);
    this._routemap.set("constraints", this.ejpMenuModel[4]);
    this._routemap.set("roles", this.ejpMenuModel[4]);
    this._routemap.set("static-resources", this.ejpMenuModel[4]);
    this._routemap.set("login", this.ejpMenuModel[5]);
    this._routemap.set("session", this.ejpMenuModel[6]);
    this._routemap.set("resource-map", this.ejpMenuModel[7]);
  }

  private initMenu():void {
    let path:string = this.EJP_PATH + this.ejpDirectory;
    this.ejpMenuModel = [
      { label: "General", icon: "fa fa-info-circle", routerLink: [path + "/general"] },
      { label: "Context", icon: "fa fa-list", routerLink: [path + "/context"]},
      { label: "Jslets", icon: "fa fa-file-code-o", routerLink: [path + "/jslets"] },
      { label: "Filters", icon: "fa fa-filter", disabled:true },
      { label: "Security", icon: "fa fa-shield", routerLink: [path + "/security/roles"] },
      { label: "Login", icon: "fa fa-lock", routerLink: [path + "/login"] },
      { label: "Session", icon: "fa fa-user-circle-o", routerLink: [path + "/session"] },
      { label: "Resource Map", icon: "fa fa-map-o", routerLink: [path + "/resource-map"] }
    ];
  }
}