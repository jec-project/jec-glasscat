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

import {Component, OnInit} from "@angular/core";
import {MenuItem, Message} from "primeng/components/common/api";
import {ConsoleMessage} from "../business/messaging/ConsoleMessage";
import {MessagingService} from "../services/messaging/MessagingService";
import {BreadcrumbService} from "../services/messaging/BreadcrumbService";
import {ConfirmDialogMessageService} from "../services/messaging/ConfirmDialogMessageService";
import {DialogMessageService} from "../services/messaging/DialogMessageService";
import {WaitingService} from "../services/messaging/WaitingService";
import {ConfirmationService} from "primeng/components/common/api";

@Component({
  selector: "console-app",
  templateUrl: "./templates/console-app.html"
})
export class ConsoleAppComponent implements OnInit {

  constructor(private _messagingService:MessagingService,
              private _breadcrumbService:BreadcrumbService,
              private _confirmationService:ConfirmationService,
              private _confirmDialogMessageService:ConfirmDialogMessageService,
              private _dialogMessageService:DialogMessageService,
              private _waitingService:WaitingService){}

  private appLocked:boolean = false;

  private appMenuModel:MenuItem[] = null;
  private userMenuModel:MenuItem[] = null;
  private messagesModel:Message[] = null;
  private breadcrumbModel:MenuItem[] = null;

  private dialogDisplay:boolean = false;
  private dialogSummary:string = "";
  private dialogDetail:string = "";

  public ngOnInit():void {
    this.userMenuModel = [
      {
        label: "Logout",
        icon: "fa fa-sign-out",
        url: "./logout"
      }
    ];
    this.appMenuModel = [
      {
        label: "Welcome",
        icon: "fa fa-paw",
        routerLink: ["/welcome"]
      },
      {
        label: "Configuration",
        icon: "fa fa-gear",
        items: [
          {
            label: "Global Information",
            icon: "fa fa-info-circle",
            routerLink: ["/configuration/info"]
          },
          {
            label: "Loggers",
            icon: "fa fa-file-code-o",
            routerLink: ["/configuration/loggers"]
          },
          {
            label: "HTTP Tasks",
            icon: "fa fa-plug",
            routerLink: ["/configuration/httptasks"]
          },
          {
            label: "Security",
            icon: "fa fa-shield",
            routerLink: ["/configuration/security"]
          },
          {
            label: "Modules",
            icon: "fa fa-cubes",
            routerLink: ["/configuration/modules"]
          }
        ]
      },
      {
        label: "Domains",
        icon: "fa fa-sitemap",
        routerLink: ["/domains"]
      },
      {
        label: "Administration",
        icon: "fa fa-list-alt"
      },
      {
        label: "System",
        icon: "fa fa-wrench",
        items: [
          {
            label: "Config",
            icon: "fa fa-tasks",
            routerLink: ["/system/config"]
          },
          {
            label: "Environment",
            icon: "fa fa-desktop",
            routerLink: ["/system/environment"]
          },
          {
            label: "Processes",
            icon: "fa fa-rotate-left",
            routerLink: ["/system/processes"]
          },
          {
            label: "Disks",
            icon: "fa fa-hdd-o"
          }
        ]
      },
      {
        label: "Terminal",
        icon: "fa fa-terminal",
        routerLink: ["/terminal"]
      }
    ];

    this.messagesModel = new Array<Message>();
    this._messagingService.getMessages().subscribe(
      data => {
        this.messagesModel.pop();
        this.messagesModel.push(data);
      },
      err => {
        console.error(err);
      }
    );

    this._messagingService.push(
      ConsoleMessage.buildMessage(
        "info",
        "Welcome",
        "GlassCat Server Open Source Edition 1.0.0 (Korat)."
      )
    );

    this._breadcrumbService.getMessages().subscribe(
      data => {
        this.breadcrumbModel = data;
      },
      err => {
        console.error(err);
      }
    );

    this._confirmDialogMessageService.getMessages().subscribe(
      data => {
        this._confirmationService.confirm(data);
      },
      err => {
        console.error(err);
      }
    );

    this._dialogMessageService.getMessages().subscribe(
      data => {
        this.dialogSummary = data.summary;
        this.dialogDetail = data.detail;
        this.dialogDisplay = true;
      },
      err => {
        console.error(err);
      }
    );

    this._waitingService.getMessages().subscribe(
      data => {
        this.appLocked = data;
      },
      err => {
        console.error(err);
      }
    );
  }
}