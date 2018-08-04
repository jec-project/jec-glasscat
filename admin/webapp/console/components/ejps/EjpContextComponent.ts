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
import {EjpWebAppConfig} from "jec-glasscat-config";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {AbstractEjpComponent} from "./AbstractEjpComponent";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-context.html"
})
export class EjpContextComponent extends AbstractEjpComponent
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

  public ejpContextForm:FormGroup = null;

  public stateList:SelectItem[] = null;
  
  public onParamsLoad():void {
    this.initStateList();
    this._ejpContextRootControl = new FormControl(this.EMPTY_STRING, Validators.required);
    this._ejpStateControl = new FormControl(this.EMPTY_STRING);
    this._ejpWelcomeFileControl = new FormControl(this.EMPTY_STRING);
    this.ejpContextForm = this._fb.group({
      contextRoot: this._ejpContextRootControl,
      state: this._ejpStateControl,
      welcomeFile: this._ejpWelcomeFileControl
    });
  }

  public onEjpLoad():void {
    const webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    this.ejpContextForm.patchValue( { contextRoot: webapp.contextRoot });
    this.ejpContextForm.patchValue( { state: webapp.state });
    this.ejpContextForm.patchValue( { welcomeFile: webapp.welcomeFile });
  }

  public openBootstrapManager():void {
    this.__router.navigate(["./ejps/" + this.ejpDirectory + "/context/bootstrap-files-manager"]);
  }

  public saveContextFormChanges():void {
    const webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    webapp.contextRoot = this.ejpContextForm.get("contextRoot").value;
    webapp.state = this.ejpContextForm.get("state").value;
    webapp.welcomeFile = this.ejpContextForm.get("welcomeFile").value;
    this.updateEjp();
  }

  protected __paramLabel:string = "Context properties";
  protected __paramLink:string[] = ['/context'];
  
  private initStateList():void {
    this.stateList = [
        { label:"none", value: undefined },
        { label:"stateful", value: "stateful" },
        { label:"stateless", value: "stateless" }
    ];
  }

  private _ejpContextRootControl:FormControl = null;
  private _ejpStateControl:FormControl = null;
  private _ejpWelcomeFileControl:FormControl = null;
}