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
import {Router} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {DomainsService} from "../../services/DomainsService";
import {WorkspaceService} from "../../services/WorkspaceService";
import {Domain} from "jec-glasscat-config";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {ProjectListItem} from "../../business/ProjectListItem";

@Component({
  selector: "app-domains",
  templateUrl: "./templates/domains/domains.html"
})
export class DomainsComponent implements OnInit, OnDestroy {

  constructor(private _domainService:DomainsService,
              private _workspaceService:WorkspaceService,
              private _breadcrumbService:BreadcrumbService,
              private _dialogMessageService:DialogMessageService,
              private _router:Router){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.initWorkspace();
    this.loadDomains();
  }

  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
    if(this._workspaceSubscriber) this._workspaceSubscriber.unsubscribe();
    if(this._projectListSubscriber) this._projectListSubscriber.unsubscribe();
  }

  public domainNum:number = 0;

  public domainListModel:Domain[] = null;
  public domainWokspaceModel:ProjectListItem[] = null;

  public workspace:string = null;
  public workspaceDomainListed:boolean = false;
  public workspaceDomainNum:number = 0;

  public itemSelect(item:Domain):void {
    this._router.navigate(['/domains/edit', item.name]);
  }

  public manageItemSelect(item:Domain):void {
    const itemName:string = item.name;
    if(itemName === "admin-ejp") {
      this._router.navigate(['/ejps', "admin"]);
    } else {
      if(this._projectListSubscriber) this._projectListSubscriber.unsubscribe();
      this._projectListSubscriber = 
                        this._workspaceService.getWorkspaceProjects().subscribe(
        data => {
          let len:number = data.length;
          let project:ProjectListItem = null;
          while(len--) {
            project = data[len];
            if(itemName === project.name) {
              this._router.navigate(['/ejps', project.directory]);
              break;
            }
          }
        },
        err => {
          this._dialogMessageService.push(ConsoleMessage.buildMessage(
            "error", "Context initialization error",
            "An error occured while loading workspace projects list.<br/>You must restart the application."
          ));
          console.error(err);
        }
      );
  }
  }

  public openWizard():void {
    this._router.navigate(['/domains/wizard']);
  }

  public loadDomain(item:ProjectListItem):void {
    this._router.navigate(['/domains/load', item.directory]);
  }

  public listWorkspaceProjects():void {
    if(this._projectListSubscriber) this._projectListSubscriber.unsubscribe();
    this._projectListSubscriber = 
                        this._workspaceService.getWorkspaceProjects().subscribe(
      data => {
        const buffer:Map<string, boolean> = new Map<string, boolean>();
        let len:number = this.domainListModel.length;
        let project:ProjectListItem = null;
        while(len--) {
          buffer.set(this.domainListModel[len].name, true);
        }
        len = data.length;
        this.workspaceDomainNum = len;
        while(len--) {
          project = data[len];
          if(buffer.has(project.name)) project.deployed = true;
        }
        this.workspaceDomainListed = true;
        this.domainWokspaceModel = data;
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Context initialization error",
          "An error occured while loading workspace projects list.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }

  private _subscriber:Subscription = null;
  private _workspaceSubscriber:Subscription = null;
  private _projectListSubscriber:Subscription = null;
  
  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Domains", ['/domains'])
    ]);
  }

  private initWorkspace():void {
    this._workspaceSubscriber = 
                        this._workspaceService.getWorkspaceLocation().subscribe(
      data => {
        this.workspace = data;
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Context initialization error",
          "An error occured while loading workspace configuration.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }

  private loadDomains():void {
    this._subscriber = this._domainService.getAll().subscribe(
      data => {
        this.domainListModel = data;
        this.domainNum = this.domainListModel.length;
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