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
import {JsletService} from "../../services/JsletService";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {AbstractEjpComponent} from "./AbstractEjpComponent";
import {JsletFileInfo} from "../../business/EjpFileInfo";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-create-jslet.html"
})
export class EjpCreateJsletComponent extends AbstractEjpComponent
                                     implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute,
              private _jsletService:JsletService,
              private _fb:FormBuilder){
    super(
      __ejpService, __breadcrumbService, __dialogMessageService,
      __messagingService, __router, __route
    );
  }

  public ejpDirectory:string = null;
  public ejpCreateJsletForm:FormGroup = null;
  
  public onParamsLoad():void {
    this._ejpNameControl = new FormControl(
      this.EMPTY_STRING,
      Validators.compose([Validators.required, Validators.minLength(3)])
    );
    this._ejpPackageControl = new FormControl(
      this.EMPTY_STRING,
      Validators.compose([Validators.required, Validators.minLength(3)])
    );
    this._ejpAddOptionControl = new FormControl(this.EMPTY_STRING);
    this.ejpCreateJsletForm = this._fb.group({
      name: this._ejpNameControl,
      package: this._ejpPackageControl,
      addOption: this._ejpAddOptionControl
    });
    this.ejpCreateJsletForm.patchValue( { package:"jslets/" } );
    this.ejpCreateJsletForm.patchValue( { addOption:true } );
  }
  
  public createJslet():void {
    let fileInfo:JsletFileInfo = new JsletFileInfo();
    let jslets:string[] = this.__ejpModel.webapp.jslets.config;
    let path:string = this._ejpPackageControl.value;
    let addOption:boolean = this._ejpAddOptionControl.value;
    let slashId:number = path.lastIndexOf(this.SLASH);
    let className:string = this._ejpNameControl.value;
    let fullPath:string = null;
    if(slashId === path.length - 1) {
      path = path.substring(0, slashId);
    }
    fullPath = path !== this.EMPTY_STRING ? path + this.SLASH + className : className;
    fileInfo.ejpDirectory = this.ejpDirectory;
    fileInfo.path = path;
    fileInfo.className = className;
    if(this._jsletUpdateSubscriber) this._jsletUpdateSubscriber.unsubscribe();
    this._jsletUpdateSubscriber = this._jsletService.create(fileInfo).subscribe(
      data => {
        this.__messagingService.push(
          ConsoleMessage.buildMessage("success", "Jslet file created")
        );
        this._jsletUpdateSubscriber.unsubscribe();
        if(addOption === true) {
          jslets.push(fullPath);
          this.updateEjp();
        }
      },
      err => {
        this.__dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "File creation error",
          "An error occured while creating the jslet file.<br/>You must restart the application."
        ));
        console.log(err);
      }
    );
  }

  public onEjpUpdate():void {
    this.closeSubView();
  }

  protected initBreadcrumb():void {
    let dirPath:string = this.SLASH + this.ejpDirectory;
    this.__breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", [this.SLASH]),
      ConsoleMenuItem.buildItem("Domains", ['/domains']),
      ConsoleMenuItem.buildItem("EJPs"),
      ConsoleMenuItem.buildItem(this.ejpDirectory, [dirPath]),
      ConsoleMenuItem.buildItem("Jslets properties", [dirPath + "/jslets"]),
      ConsoleMenuItem.buildItem("Create", [dirPath + "/jslets/create"])
    ]);
  }

  private _jsletUpdateSubscriber:Subscription = null;
  private _ejpNameControl:FormControl = null;
  private _ejpPackageControl:FormControl = null;
  private _ejpAddOptionControl:FormControl = null;
}