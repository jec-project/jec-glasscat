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
import {RoleService} from "../../services/RoleService";
import {EjpRoleConfig, EjpSecurityConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {EjpAbstractSecurityComponent} from "./EjpAbstractSecurityComponent";
import {SelectItem} from "primeng/components/common/api";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {RoleFileInfo} from "../../business/EjpFileInfo";
import {ClassPathProperties, ClassPathUtils} from "../../utils/ClassPathUtils";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-security-roles.html"
})
export class EjpRolesComponent extends EjpAbstractSecurityComponent
                               implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute,
              private _fb:FormBuilder,
              private _roleService:RoleService){
    super(
      __ejpService, __breadcrumbService, __dialogMessageService,
      __messagingService, __router, __route,
      "Roles", "roles"
    );
    this._classPathUtils = new ClassPathUtils();
  }

  public ejpRolesForm:FormGroup = null;
  public roleEditable:boolean = false;

  public onEjpLoad():void {
    this.initRoleModel();
  }

  public onParamsLoad():void {
    this._ejpRoleNameControl =
      new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpClassNameControl =
      new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpRolePathControl = new FormControl(this.EMPTY_STRING);
    this._ejpCreateClassOptionControl = new FormControl(this.EMPTY_STRING);
    this.ejpRolesForm = this._fb.group({
      roleName: this._ejpRoleNameControl,
      className: this._ejpClassNameControl,
      rolePath: this._ejpRolePathControl,
      createClassOption: this._ejpCreateClassOptionControl
    });
   this.resetCreateClassOption(); 
  }

  public roleListChange():void {
    let role:EjpRoleConfig = null;
    let props:ClassPathProperties = null;
    if(this.selectedItem) {
      this.roleEditable = true;
      role = this.selectedItem as EjpRoleConfig;
      props = this._classPathUtils.getClassPathProperties(role.path);
      this.ejpRolesForm.patchValue({ 
        roleName: role.name,
        className: props.className,
        rolePath: props.classPath
      });
    } else {
      this.cancel();
    }
  }
  
  public cancel():void {
    this.selectedItem = null;
    this.ejpRolesForm.reset();
    this.resetCreateClassOption();
    this.roleEditable = false;
  }

  public onEjpUpdate():void {
    this.cancel();
    this.initRoleModel();
  }
  
  public createRole():void {
    let roles:Array<EjpRoleConfig> = this.__ejpModel.webapp.security.roles;
    let roleName:string = this._ejpRoleNameControl.value;
    let props:ClassPathProperties =
      this._classPathUtils.createClassPathProperties(
        this._ejpClassNameControl.value,
        this._ejpRolePathControl.value
      );
    let role:EjpRoleConfig = null;
    let createClass:boolean = this._ejpCreateClassOptionControl.value;
    let fileInfo:RoleFileInfo = null;
    if(createClass) {
      fileInfo = new RoleFileInfo();
      fileInfo.className = props.className;
      fileInfo.ejpDirectory = this.ejpDirectory;
      fileInfo.path = props.classPath;
      fileInfo.role = roleName;
      if(this._roleUpdateSubscriber) this._roleUpdateSubscriber.unsubscribe();
      this._roleUpdateSubscriber = this._roleService.create(fileInfo).subscribe(
        data => {
          this.__messagingService.push(
            ConsoleMessage.buildMessage("success", "Role class created")
          );
          this._roleUpdateSubscriber.unsubscribe();
          role = {
            name: roleName,
            path: props.fullPath
          };
          roles.push(role);
          this.updateEjp();
        },
        err => {
          this.__dialogMessageService.push(ConsoleMessage.buildMessage(
            "error", "File creation error",
            "An error occured while creating the role class.<br/>You must restart the application."
          ));
          console.log(err);
        }
      );
    } else {
      role = {
        name: roleName,
        path: props.fullPath
      };
      roles.push(role);
      this.updateEjp();
    }
  }
  
  public updateRole():void {
    let props:ClassPathProperties =
      this._classPathUtils.createClassPathProperties(
        this._ejpClassNameControl.value,
        this._ejpRolePathControl.value
      );
    let role:EjpRoleConfig = this.selectedItem as EjpRoleConfig;
    role.name = this._ejpRoleNameControl.value;
    role.path = props.fullPath;
    this.updateEjp();
  }

  public removeRole():void {
    let roles:Array<EjpRoleConfig> = this.__ejpModel.webapp.security.roles;
    let role:EjpRoleConfig = this.selectedItem as EjpRoleConfig;
    roles.splice(roles.indexOf(role), 1);
    this.updateEjp();
  }

  private _ejpRoleNameControl:FormControl = null;
  private _ejpRolePathControl:FormControl = null;
  private _ejpClassNameControl:FormControl = null;
  private _ejpCreateClassOptionControl:FormControl = null;
  private _classPathUtils:ClassPathUtils = null;
  private _roleUpdateSubscriber:Subscription = null;

  private resetCreateClassOption():void {
    this.ejpRolesForm.patchValue( { createClassOption: true });
  }

  private initRoleModel():void {
    let security:EjpSecurityConfig = this.__ejpModel.webapp.security;
    let roles:EjpRoleConfig[] = security.roles;
    let role:EjpRoleConfig = null;
    let len:number = roles.length;
    let roleList:SelectItem[] = new Array<SelectItem>();
    if(this.itemListModel) this.itemListModel.splice(0);
    while(len--) {
      role = roles[len];
      roleList.push( { label: role.name, value: role } );
    }
    this.itemListModel = roleList;
  }
}