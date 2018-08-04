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
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {Subscription} from "rxjs/Rx";
import {ContextService} from "../../services/ContextService";
import {LocaleService} from "../../services/LocaleService";
import {MessagingService} from "../../services/messaging/MessagingService";
import {BootstrapConfig} from "jec-glasscat-config";

@Component({
  selector: 'app-server-config',
  templateUrl: "./templates/configuration/modules.html",
})
export class ModulesComponent implements OnInit, OnDestroy {

  constructor(private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _localeService:LocaleService,
              private _messagingService:MessagingService){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.getContext();
  }

  public ngOnDestroy():void {
    this._contextSubscriber.unsubscribe();
  }

  public saveContext():void {
    
  }

  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("Modules", ['/configuration/module'])
    ]);
  }
  
  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
      },
      err => {
        console.error(err);
      }
    );
  }
}