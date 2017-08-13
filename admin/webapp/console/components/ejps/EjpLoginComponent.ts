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
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {EjpService} from "../../services/EjpService";
import {EjpLoginConfig, EjpFormConfig, EjpRealmConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {AbstractEjpComponent} from "./AbstractEjpComponent";
import {SelectItem} from "primeng/components/common/api";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-login.html"
})
export class EjpLoginComponent extends AbstractEjpComponent
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
    this.initFormTypeList();
  }

  public currentForm:string = "login";
  public formTypeList:SelectItem[] = null;

  public ejpLoginForm:FormGroup = null;
  public ejpRealmForm:FormGroup = null;

  public authMethodList:SelectItem[] = null;
  public realmTypeList:SelectItem[] = null;

  public hasEjpFormConfig:boolean = false;
  public customRealmMode:boolean = false;

  public onEjpLoad():void {
    let login:EjpLoginConfig = this.__ejpModel.webapp.login;
    let form:EjpFormConfig = login.formConfig;
    let realm:EjpRealmConfig = login.realm;
    
    this.ejpLoginForm.patchValue( { authMethod: login.authMethod });
    this.ejpLoginForm.patchValue( { errorUrl: form.errorUrl });
    this.ejpLoginForm.patchValue( { loginUrl: form.loginUrl });

    this.ejpRealmForm.patchValue( { realmType: realm.type });
    this.ejpRealmForm.patchValue( { securedArea: realm.securedArea });
    this.ejpRealmForm.patchValue( { connectorFactory: realm.connectorFactory });

    this.checkEjpFormConfigDisplay();
    this.checkCustomRealmModeDisplay();
  }

  public saveLoginFormChanges():void {
    let login:EjpLoginConfig = this.__ejpModel.webapp.login;
    let EjpFormConfig:EjpFormConfig = login.formConfig;
    let authMethod:string = this.ejpLoginForm.get("authMethod").value;
    login.authMethod = authMethod;
    if(authMethod === "form" || authMethod === "ejp-form") {
      EjpFormConfig.errorUrl = this.ejpLoginForm.get("errorUrl").value;
      EjpFormConfig.loginUrl = this.ejpLoginForm.get("loginUrl").value;
    } else {
      EjpFormConfig.errorUrl = EjpFormConfig.loginUrl = null;
    }
    this.updateEjp();
  }

  public saveRealmFormChanges():void {
    let realm:EjpRealmConfig = this.__ejpModel.webapp.login.realm;
    let type:string = this.ejpRealmForm.get("realmType").value;
    realm.type = type;
    realm.securedArea = this.ejpRealmForm.get("securedArea").value;
    if(type === "custom") {
      realm.connectorFactory = this.ejpRealmForm.get("connectorFactory").value;
    } else {
      realm.connectorFactory = null;
    }
    this.updateEjp();
  }

  public authMethodListChange():void {
    this.checkEjpFormConfigDisplay();
  }

  public realmTypeListChange():void {
    this.checkCustomRealmModeDisplay();
  }

  public onParamsLoad():void {
    this.initAuthMethodList();
    this.initRealmTypeList();
    this._ejpAuthMethodControl = new FormControl(this.EMPTY_STRING);
    this._ejpLoginUrlControl = new FormControl(this.EMPTY_STRING);
    this._ejpErrorUrlControl = new FormControl(this.EMPTY_STRING);
    this.ejpLoginForm = this._fb.group({
      authMethod: this._ejpAuthMethodControl,
      loginUrl: this._ejpLoginUrlControl,
      errorUrl: this._ejpErrorUrlControl,
    });
    this._ejpConnectorFactoryControl = new FormControl(this.EMPTY_STRING);
    this._ejpSecuredAreaControl = new FormControl(this.EMPTY_STRING);
    this._ejpRealmTypeControl = new FormControl(this.EMPTY_STRING);
    this.ejpRealmForm = this._fb.group({
      realmType: this._ejpRealmTypeControl,
      connectorFactory: this._ejpConnectorFactoryControl,
      securedArea: this._ejpSecuredAreaControl
    });
  }

  protected __paramLabel:string = "Login properties";
  protected __paramLink:string[] = ['/login'];

  private _ejpAuthMethodControl:FormControl = null;
  private _ejpLoginUrlControl:FormControl = null;
  private _ejpErrorUrlControl:FormControl = null;

  private _ejpRealmTypeControl:FormControl = null;
  private _ejpSecuredAreaControl:FormControl = null;
  private _ejpConnectorFactoryControl:FormControl = null;

  private initFormTypeList():void {
    this.formTypeList = new Array<SelectItem>();
    this.formTypeList.push( { label:"Login", value:"login"} );
    this.formTypeList.push( { label:"Realm", value:"realm"} );
  }

  private initAuthMethodList():void {
    this.authMethodList = [
        { label:"none", value: undefined },
        { label:"ejp-form", value: "ejp-form" },
        { label:"form", value: "form" },
        { label:"basic", value: "basic" },
        { label:"digest", value: "digest" }
    ];
  }

  private initRealmTypeList():void {
    this.realmTypeList = [
        { label:"none", value: undefined },
        { label:"admin-file", value: "admin-file" },
        { label:"file", value: "file" },
        { label:"ldap", value: "ldap" },
        { label:"db", value: "db" },
        { label:"custom", value: "custom" }
    ];
  }

  private checkEjpFormConfigDisplay():void {
    switch(this._ejpAuthMethodControl.value) {
      case "ejp-form":
      case "form":
        this.hasEjpFormConfig = true;
        break;
      default :
        this.hasEjpFormConfig = false;
    }
  }

  private checkCustomRealmModeDisplay():void {
    this.customRealmMode = (this._ejpRealmTypeControl.value === "custom");
  }
}