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
import {EjpWebAppConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from "../../services/messaging/MessagingService";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {AbstractEjpComponent} from "./AbstractEjpComponent";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-general.html"
})
export class EjpGeneralComponent extends AbstractEjpComponent
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

  public ejpGeneralForm:FormGroup = null;

  public onEjpLoad():void {
    let webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    this.ejpGeneralForm.patchValue( { name: webapp.name });
    this.ejpGeneralForm.patchValue( { description: webapp.description });
    this.ejpGeneralForm.patchValue( { version: webapp.version });
    this.ejpGeneralForm.patchValue( { author: webapp.author });
    this._ejpNameControl.disable();
  }

  public onParamsLoad():void {
    this._ejpNameControl = new FormControl({disabled: true}, Validators.required);
    this._ejpDescriptionControl = new FormControl(this.EMPTY_STRING);
    this._ejpVersionControl = new FormControl(this.EMPTY_STRING);
    this._ejpAuthorControl = new FormControl(this.EMPTY_STRING);
    this.ejpGeneralForm = this._fb.group({
      name: this._ejpNameControl,
      description: this._ejpDescriptionControl,
      version: this._ejpVersionControl,
      author: this._ejpAuthorControl
    });
  }

  public saveGeneralFormChanges():void {
    let webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    webapp.name = this.ejpGeneralForm.get("name").value;
    webapp.description = this.ejpGeneralForm.get("description").value;
    webapp.version = this.ejpGeneralForm.get("version").value;
    webapp.author = this.ejpGeneralForm.get("author").value;
    this.updateEjp();
  }

  protected __paramLabel:string = "General properties";
  protected __paramLink:string[] = ['/general'];

  private _ejpNameControl:FormControl = null;
  private _ejpDescriptionControl:FormControl = null;
  private _ejpVersionControl:FormControl = null;
  private _ejpAuthorControl:FormControl = null;
}