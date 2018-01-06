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
import {EjpConstraintConfig, EjpSecurityConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {EjpAbstractSecurityComponent} from "./EjpAbstractSecurityComponent";
import {SelectItem} from "primeng/components/common/api";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-security-constraints.html"
})
export class EjpConstraintsComponent extends EjpAbstractSecurityComponent
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
      "Constraints", "constraints"
    );
  }

  public ejpConstraintForm:FormGroup = null;
  public constraintEditable:boolean = false;

  public onEjpLoad():void {
    this.initConstraintModel();
  }

  public onParamsLoad():void {
    this._ejpNameControl =
      new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpRolesControl =
      new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpUrlPatternControl = 
      new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpErrorUrlControl = new FormControl(this.EMPTY_STRING);
    this.ejpConstraintForm = this._fb.group({
      constraintName: this._ejpNameControl,
      constraintRoles: this._ejpRolesControl,
      urlPattern: this._ejpUrlPatternControl,
      errorUrl: this._ejpErrorUrlControl
    });
  }

  public selectListChange():void {
    if(this.selectedItem) {
      this.constraintEditable = true;
      let constraint:EjpConstraintConfig = this.selectedItem as EjpConstraintConfig;
      this.ejpConstraintForm.patchValue( { constraintName: constraint.name });
      this.ejpConstraintForm.patchValue( { constraintRoles: constraint.roles.join(", ") });
      this.ejpConstraintForm.patchValue( { urlPattern: constraint.urlPattern });
      this.ejpConstraintForm.patchValue( { errorUrl: constraint.errorUrl });
    } else {
      this.cancel();
    }
  }
  
  public cancel():void {
    this.selectedItem = null;
    this.ejpConstraintForm.reset();
    this.constraintEditable = false;
  }

  public onEjpUpdate():void {
    this.cancel();
    this.initConstraintModel();
  }
  
  public createResource():void {
    let constraints:Array<EjpConstraintConfig> = this.__ejpModel.webapp.security.constraints;
    let constraint:EjpConstraintConfig = {
      name: this.ejpConstraintForm.get("constraintName").value,
      roles: this.getRolesArray(),
      urlPattern: this.ejpConstraintForm.get("urlPattern").value,
      errorUrl: this.ejpConstraintForm.get("errorUrl").value
    };
    constraints.push(constraint);
    this.updateEjp();
  }
  
  public updateConstraint():void {
    let constraint:EjpConstraintConfig = this.selectedItem as EjpConstraintConfig;
    constraint.name = this.ejpConstraintForm.get("constraintName").value;
    constraint.roles = this.getRolesArray();
    constraint.urlPattern = this.ejpConstraintForm.get("urlPattern").value;
    constraint.errorUrl = this.ejpConstraintForm.get("errorUrl").value;
    this.updateEjp();
  }

  public removeConstraint():void {
    let constraints:Array<EjpConstraintConfig> = this.__ejpModel.webapp.security.constraints;
    let constraint:EjpConstraintConfig = this.selectedItem as EjpConstraintConfig;
    constraints.splice(constraints.indexOf(constraint), 1);
    this.updateEjp();
  }

  private _ejpNameControl:FormControl = null;
  private _ejpRolesControl:FormControl = null;
  private _ejpUrlPatternControl:FormControl = null;
  private _ejpErrorUrlControl:FormControl = null;
  
  private initConstraintModel():void {
    if(this.itemListModel) this.itemListModel.splice(0);
    let security:EjpSecurityConfig = this.__ejpModel.webapp.security;
    let constraints:Array<EjpConstraintConfig> = security.constraints;
    let constraint:EjpConstraintConfig = null;
    let len:number = constraints.length;
    let constraintList:SelectItem[] = new Array<SelectItem>();
    while(len--) {
      constraint = constraints[len];
      constraintList.push( { label: constraint.name, value: constraint } );
    }
    this.itemListModel = constraintList;
  }

  private getRolesArray():string[] {
    let roles:string = this.ejpConstraintForm.get("constraintRoles").value;
    roles = roles.replace(" ", this.EMPTY_STRING);
    return roles.split(",");
  }
}