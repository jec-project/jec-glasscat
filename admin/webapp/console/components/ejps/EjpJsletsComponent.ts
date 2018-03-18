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
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {EjpService} from "../../services/EjpService";
import {EjpWebAppConfig, EjpJsletsConfig} from "jec-glasscat-core";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {MessagingService} from '../../services/messaging/MessagingService';
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {AbstractEjpComponent} from "./AbstractEjpComponent";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-jslets.html"
})
export class EjpJsletsComponent extends AbstractEjpComponent
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

  public ejpJsletsForm:FormGroup = null;
  public ejpImportJsletForm:FormGroup = null;

  public jsletListModel:SelectItem[] = null;
  
  public selectedJslets:string[] = null;
  public selectedJsletList:string = null;
  public jsletEditable:boolean = false;

  public onParamsLoad():void {
    this._ejpConfigFileControl = new FormControl(this.EMPTY_STRING);
    this._ejpAutowireControl = new FormControl(this.EMPTY_STRING);
    this.ejpJsletsForm = this._fb.group({
      jsletConfigFile: this._ejpConfigFileControl,
      enableAutowire: this._ejpAutowireControl
    });
    this._ejpImportedJsletControl =
      new FormControl(
        this.EMPTY_STRING,
        Validators.compose([Validators.required, Validators.minLength(6)])
      );
    this.ejpImportJsletForm = this._fb.group({
      importedJslet: this._ejpImportedJsletControl
    });
  }

  public onEjpLoad():void {
    const webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    const jslets:EjpJsletsConfig = webapp.jslets;
    const configModel:SelectItem[] = new Array<SelectItem>();
    const config:string[] = jslets.config;
    let jslet:string = null;
    let len:number = config.length;
    this.ejpJsletsForm.patchValue( { jsletConfigFile: jslets.configFile });
    while(len--) {
      jslet = config[len];
      configModel.push(
        {label:jslet, value:jslet}
      )
    }
    this.jsletListModel = configModel;
  }

  public jsletListChange():void {
    if(this.selectedJslets.length > 0) {
      this.jsletEditable = true;
      this.selectedJsletList = this.selectedJslets.join("\n");
    } else {
      this.jsletEditable = false;
      this.selectedJsletList = this.EMPTY_STRING;
    }
  }

  public importJslet():void {
    const jslet:string = this.ejpImportJsletForm.get("importedJslet").value.toString();
    this.jsletListModel.push({label:jslet, value:jslet});
    this._ejpImportedJsletControl.reset();
  }

  public openJsletWizard():void {
    this.__router.navigate(["./ejps/" + this.ejpDirectory + "/jslets/create"]);
  }

  public removeJslets():void {
    const jslets:string[] = this.__ejpModel.webapp.jslets.config;
    const buffer:string[] = this.selectedJslets.splice(0);
    let len:number = buffer.length;
    let jslet:string = null;
    let index:number = -1;
    while(len--) {
      jslet = buffer[len];
      index = jslets.indexOf(jslet);
      jslets.splice(index, 1);
      this.jsletListModel.forEach((value:SelectItem, index:number)=> {
        if(value.label === jslet) {
          this.jsletListModel.splice(index, 1);
        }
      });
    }
    this.jsletEditable = false;
    this.selectedJsletList = this.EMPTY_STRING;
    this.updateEjp();
  }

  protected __paramLabel:string = "Jslets properties";
  protected __paramLink:string[] = ['/jslets'];

  private _ejpConfigFileControl:FormControl = null;
  private _ejpImportedJsletControl:FormControl = null;
  private _ejpAutowireControl:FormControl = null;
}