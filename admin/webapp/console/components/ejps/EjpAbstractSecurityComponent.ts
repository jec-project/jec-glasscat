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
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {AbstractEjpComponent} from "./AbstractEjpComponent";


import {SelectItem} from "primeng/components/common/api";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";

export class EjpAbstractSecurityComponent extends AbstractEjpComponent
                                          implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute,
              sectionTitle:string,
              currentForm:string){
    super(
      __ejpService, __breadcrumbService, __dialogMessageService,
      __messagingService, __router, __route
    );
    this.initFormTypeList();
    this.sectionTitle = sectionTitle;
    this.currentForm = currentForm;
  }

  
  public itemListModel:SelectItem[] = null;
  public selectedItem:any = null;

  public sectionTitle:string = null;
  public currentForm:string = null;
  public formTypeList:SelectItem[] = null;

  public readonly SECURITY_PATH:string = "/security/";

  public navigClickHandler(event:any):void {
    const path:string = this.PARENT_PATH + this.currentForm;
    this.__router.navigate([path], { relativeTo: this.__route });
  }

  protected initBreadcrumb():void {
    const dirPath:string = this.SLASH + this.ejpDirectory;
    this.__breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", [this.SLASH]),
      ConsoleMenuItem.buildItem("EJPs"),
      ConsoleMenuItem.buildItem(this.ejpDirectory, [dirPath]),
      ConsoleMenuItem.buildItem("Security properties", [dirPath + "/security/roles"]),
      ConsoleMenuItem.buildItem(this.sectionTitle, [dirPath + this.SECURITY_PATH + this.currentForm])
    ]);
  }

  private initFormTypeList():void {
    this.formTypeList = new Array<SelectItem>();
    this.formTypeList.push( { label:"Roles", value:"roles"} );
    this.formTypeList.push( { label:"Constraints", value:"constraints"} );
    this.formTypeList.push( { label:"Static resources", value:"resources"} );
  }
}