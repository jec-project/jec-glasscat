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
import {EjpService} from "../../services/EjpService";
import {EjpStaticResourcesConfig, EjpSecurityConfig} from "jec-glasscat-config";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {EjpAbstractSecurityComponent} from "./EjpAbstractSecurityComponent";
import {SelectItem} from "primeng/components/common/api";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-security-static-resources.html"
})
export class EjpStaticResourcesComponent extends EjpAbstractSecurityComponent
                               implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute,
              private _fb:FormBuilder){
    super(
      __ejpService, __breadcrumbService, __dialogMessageService,
      __messagingService, __router, __route,
      "Static resources", "resources"
    );
  }

  public ejpResourcesForm:FormGroup = null;
  public resourceEditable:boolean = false;

  public onEjpLoad():void {
    this.initResourceModel();
  }

  public onParamsLoad():void {
    this._ejpUrlPatternControl =
      new FormControl(this.EMPTY_STRING, Validators.required);
    this.ejpResourcesForm = this._fb.group({
      urlPattern: this._ejpUrlPatternControl
    });
  }

  public selectListChange():void {
    if(this.selectedItem) {
      this.resourceEditable = true;
      const resources:EjpStaticResourcesConfig = this.selectedItem as EjpStaticResourcesConfig;
      this.ejpResourcesForm.patchValue( { urlPattern: resources.urlPattern });
    } else {
      this.cancel();
    }
  }
  
  public cancel():void {
    this.selectedItem = null;
    this.ejpResourcesForm.reset();
    this.resourceEditable = false;
  }

  public onEjpUpdate():void {
    this.cancel();
    this.initResourceModel();
  }
  
  public createResource():void {
    const resources:Array<EjpStaticResourcesConfig> = this.__ejpModel.webapp.security.staticResources;
    const resource:EjpStaticResourcesConfig = {
      urlPattern: this.ejpResourcesForm.get("urlPattern").value,
      cacheControlPolicy: null
    };
    resources.push(resource);
    this.updateEjp();
  }
  
  public updateResource():void {
    const resource:EjpStaticResourcesConfig = this.selectedItem as EjpStaticResourcesConfig;
    resource.urlPattern = this.ejpResourcesForm.get("urlPattern").value;
    this.updateEjp();
  }

  public removeResource():void {
    const resources:Array<EjpStaticResourcesConfig> = this.__ejpModel.webapp.security.staticResources;
    const resource:EjpStaticResourcesConfig = this.selectedItem as EjpStaticResourcesConfig;
    resources.splice(resources.indexOf(resource), 1);
    this.updateEjp();
  }

  private _ejpUrlPatternControl:FormControl = null;
  
  private initResourceModel():void {
    if(this.itemListModel) this.itemListModel.splice(0);
    const security:EjpSecurityConfig = this.__ejpModel.webapp.security;
    const resources:Array<EjpStaticResourcesConfig> = security.staticResources;
    const resourceList:SelectItem[] = new Array<SelectItem>();
    let resource:EjpStaticResourcesConfig = null;
    let len:number = resources.length;
    while(len--) {
      resource = resources[len];
      resourceList.push( { label: resource.urlPattern, value: resource } );
    }
    this.itemListModel = resourceList;
  }
}