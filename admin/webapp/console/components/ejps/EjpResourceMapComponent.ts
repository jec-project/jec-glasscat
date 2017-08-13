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
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {EjpService} from "../../services/EjpService";
import {EjpWebAppConfig, EjpResourceMapperConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {AbstractEjpComponent} from "./AbstractEjpComponent";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-resource-map.html"
})
export class EjpResourceMapComponent extends AbstractEjpComponent
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
      __messagingService, __router, __route
    );
  }

  public ejpResourceMapForm:FormGroup = null;

  public resourceListModel:SelectItem[] = null;
  
  public selectedResource:any = null;
  public resourceEditable:boolean = false;

  public onParamsLoad():void {
    this._ejpResourceNameControl = new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpResourceMappingControl = new FormControl(this.EMPTY_STRING, Validators.required);
    this.ejpResourceMapForm = this._fb.group({
      resourceName: this._ejpResourceNameControl,
      resourceMapping: this._ejpResourceMappingControl
    });
  }

  public onEjpLoad():void {
    this.initResourceModel();
  }

  public resourceListChange():void {
    if(this.selectedResource) {
      this.resourceEditable = true;
      let resource:EjpResourceMapperConfig = this.selectedResource as EjpResourceMapperConfig;
      this.ejpResourceMapForm.patchValue( { resourceName: resource.name });
      this.ejpResourceMapForm.patchValue( { resourceMapping: resource.value });
    } else {
      this.cancel();
    }
  }

  public cancel():void {
    this.selectedResource = null;
    this.ejpResourceMapForm.reset();
    this.resourceEditable = false;
  }

  public onEjpUpdate():void {
    this.cancel();
    this.initResourceModel();
  }
  
  public createResource():void {
    let resources:Array<EjpResourceMapperConfig> = this.__ejpModel.webapp.resourceMap;
    let resource:EjpResourceMapperConfig = {
      name: this.ejpResourceMapForm.get("resourceName").value,
      value: this.ejpResourceMapForm.get("resourceMapping").value
    };
    resources.push(resource);
    this.updateEjp();
  }
  
  public updateResource():void {
    let resource:EjpResourceMapperConfig = this.selectedResource as EjpResourceMapperConfig;
    resource.name = this.ejpResourceMapForm.get("resourceName").value;
    resource.value = this.ejpResourceMapForm.get("resourceMapping").value;
    this.updateEjp();
  }

  public removeResource():void {
    let resources:Array<EjpResourceMapperConfig> = this.__ejpModel.webapp.resourceMap;
    let resource:EjpResourceMapperConfig = this.selectedResource as EjpResourceMapperConfig;
    resources.splice(resources.indexOf(resource), 1);
    this.updateEjp();
  }

  protected __paramLabel:string = "Resource Map properties";
  protected __paramLink:string[] = ['/resource-map'];

  private _ejpResourceNameControl:FormControl = null;
  private _ejpResourceMappingControl:FormControl = null;
  
  private initResourceModel():void {
    let webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    let resources:Array<EjpResourceMapperConfig> = webapp.resourceMap;
    let configModel:SelectItem[] = new Array<SelectItem>();
    let resource:EjpResourceMapperConfig = null;
    let len:number = -1;
    if(resources) {
      len = resources.length;
      while(len--) {
        resource = resources[len];
        configModel.push(
          { label:resource.name, value:resource }
        );
      }
    }
    this.resourceListModel = configModel;
  }
}