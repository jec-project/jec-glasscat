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
import {EjpSessionConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {AbstractEjpComponent} from "./AbstractEjpComponent";
import {SelectItem} from "primeng/components/common/api";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-session.html"
})
export class EjpSessionComponent extends AbstractEjpComponent
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

  public ejpSessionForm:FormGroup = null;

  public storageList:SelectItem[] = null;

  public onEjpLoad():void {
    const session:EjpSessionConfig = this.__ejpModel.webapp.session;
    this.ejpSessionForm.patchValue( { errorUrl: session.errorUrl });
    this.ejpSessionForm.patchValue( { maxAge: session.maxAge });
    this.ejpSessionForm.patchValue( { storage: session.storage });
  }

  public onParamsLoad():void {
    this.initStorageList();
    this._ejpErrorUrlControl = new FormControl(this.EMPTY_STRING);
    this._ejpMaxAgeControl = new FormControl(this.EMPTY_STRING);
    this._ejpStorageControl = new FormControl(this.EMPTY_STRING);
    this.ejpSessionForm = this._fb.group({
      errorUrl: this._ejpErrorUrlControl,
      storage: this._ejpStorageControl,
      maxAge: this._ejpMaxAgeControl
    });
  }

  public saveSessionFormChanges():void {
    const session:EjpSessionConfig = this.__ejpModel.webapp.session;
    session.storage = this.ejpSessionForm.get("storage").value;
    session.errorUrl = this.ejpSessionForm.get("errorUrl").value;
    session.maxAge = this.ejpSessionForm.get("maxAge").value;
    this.updateEjp();
  }

  protected __paramLabel:string = "Session properties";
  protected __paramLink:string[] = ['/session'];

  private initStorageList():void {
    this.storageList = [
        { label:"none", value: undefined },
        { label:"local", value: "local" },
        { label:"redis", value: "redis" }
    ];
  }

  private _ejpErrorUrlControl:FormControl = null;
  private _ejpMaxAgeControl:FormControl = null;
  private _ejpStorageControl:FormControl = null;
}