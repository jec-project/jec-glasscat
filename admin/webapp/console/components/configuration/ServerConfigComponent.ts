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
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {BootstrapConfig} from "jec-glasscat-core";

@Component({
  selector: 'app-server-config',
  templateUrl: "./templates/configuration/server-config.html",
})
export class ServerConfigComponent implements OnInit, OnDestroy {

  constructor(private _breadcrumbService:BreadcrumbService,
              private _contextService:ContextService,
              private _localeService:LocaleService,
              private _messagingService:MessagingService,
              private _dialogMessageService:DialogMessageService){}

  public version:string = null;s
  public locale:string = null;
  public editLocaleInactive:boolean = true;
  public localeList:any[] = null;
  public selectedLocale:string = null;

  public errorPage:string = null;
  public editErrorPageInactive:boolean = true;

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.getContext();
  }

  public ngOnDestroy():void {
    this._contextSubscriber.unsubscribe();
    if(this._localesSubscriber) this._localesSubscriber.unsubscribe();
  }

  public toggleErrorPageEditionMode():void {
    this.editErrorPageInactive = !this.editErrorPageInactive;
  }

  public toggleLocaleEditionMode():void {
    this.editLocaleInactive = !this.editLocaleInactive;
    if(!this.editLocaleInactive && !this.localeList) {
      this._localesSubscriber= this._localeService.getLocaleList().subscribe(
        data => {
          this.localeList = data;
          this.selectedLocale = this.locale;
        },
        err => {
          this._dialogMessageService.push(ConsoleMessage.buildMessage(
            "error", "Locale initialization error",
            "An error occured while loading available locales list.<br/>You must restart the application."
          ));
          console.error(err);
        }
      );
    }
  }

  public saveLocale():void {
    this._context.glasscat.locale = this.selectedLocale;
    if(this._contextUpdateSubscriber) this._contextUpdateSubscriber.unsubscribe();
    this._contextUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._context = data;
        this.locale = this._context.glasscat.locale;
        this.editLocaleInactive = !this.editLocaleInactive;
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "Locale changed")
        );
      },
      err => {
         this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Locale update error",
          "An error occured while updating locale settings."
        ));
        console.error(err);
      }
    );
  }

  public saveErrorPage():void {
    this._context.config.errorPage = this.errorPage;
    if(this._contextUpdateSubscriber) this._contextUpdateSubscriber.unsubscribe();
    this._contextUpdateSubscriber = 
                      this._contextService.saveContext(this._context).subscribe(
      data => {
        this._context = data;
        this.errorPage = this._context.config.errorPage;
        this.editErrorPageInactive = !this.editErrorPageInactive;
        this._messagingService.push(
          ConsoleMessage.buildMessage("success", "Error page changed")
        );
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Error page update error",
          "An error occured while updating error page settings."
        ));
        console.error(err);
      }
    );
  }

  private _contextSubscriber:Subscription = null;
  private _contextUpdateSubscriber:Subscription = null;
  private _localesSubscriber:Subscription = null;
  private _context:BootstrapConfig = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Configuration"),
      ConsoleMenuItem.buildItem("Global Information", ['/configuration/info'])
    ]);
  }
  
  private getContext():void {
    this._contextSubscriber = this._contextService.getContext().subscribe(
      data => {
        this._context = data;
        const info:any = data.glasscat;
        this.version = info.version;
        this.locale = info.locale;
        this.errorPage = data.config.errorPage;
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