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
import {BootstrapService} from "../../services/BootstrapService";
import {EjpWebAppConfig, EjpBootstrapConfig} from "jec-glasscat-config";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {DialogMessageService} from '../../services/messaging/DialogMessageService';
import {MessagingService} from '../../services/messaging/MessagingService';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {SelectItem} from "primeng/components/common/api";
import {AbstractEjpComponent} from "./AbstractEjpComponent";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {BootstrapFileInfo} from "../../business/EjpFileInfo";
import {ClassPathProperties, ClassPathUtils} from "../../utils/ClassPathUtils";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";

@Component({
  selector: "app-ejp",
  templateUrl: "./templates/ejps/ejp-bootstrap.html"
})
export class EjpBootstrapComponent extends AbstractEjpComponent
                                   implements OnInit, OnDestroy {

  constructor(protected __ejpService:EjpService,
              protected __breadcrumbService:BreadcrumbService,
              protected __dialogMessageService:DialogMessageService,
              protected __messagingService:MessagingService,
              protected __router:Router,
              protected __route:ActivatedRoute,
              private _bootstrapService:BootstrapService,
              private _fb:FormBuilder){
    super(
      __ejpService, __breadcrumbService, __dialogMessageService,
      __messagingService, __router, __route,
    );
    this._classPathUtils = new ClassPathUtils();
  }

  public editBootstrapForm:FormGroup = null;

  public bootstrapListModel:SelectItem[] = null;
  
  public selectedBootstrap:EjpBootstrapConfig = null;
  public bootstrapEditable:boolean = false;
 
  public onParamsLoad():void {
    this._ejpEditBootstrapPathControl =  new FormControl(this.EMPTY_STRING);
    this._editBootstrapClassNameControl =
      new FormControl(
        this.EMPTY_STRING,
        Validators.compose([Validators.required, Validators.minLength(3)])
      );
    this._ejpEditBootstrapPriorityControl = new FormControl(this.EMPTY_STRING);
    this.editBootstrapForm = this._fb.group({
      editBootstrapPath: this._ejpEditBootstrapPathControl,
      editBootstrapClassName: this._editBootstrapClassNameControl,
      editBootstrapPriority: this._ejpEditBootstrapPriorityControl
    }); 
  }

  public onEjpLoad():void {
    this.initBootstrapListModel();
  }

  public bootstrapListChange():void {
    let bootstrapFile:EjpBootstrapConfig = null;
    let props:ClassPathProperties = null;
    if(this.selectedBootstrap) {
      props = this._classPathUtils.getClassPathProperties(this.selectedBootstrap.path);
      this.bootstrapEditable = true;
      this.editBootstrapForm.patchValue({
        editBootstrapPath: props.classPath,
        editBootstrapClassName: props.className,
        editBootstrapPriority: this.selectedBootstrap.priority
      });
      this._ejpEditBootstrapPathControl.disable();
      this._editBootstrapClassNameControl.disable();
    }
  }

  public cancelBootstrapEdit():void {
    this.selectedBootstrap = null;
    this.resetForm();
  }

  public resetForm():void {
    this.editBootstrapForm.reset();
    this.bootstrapEditable = false;
    this._ejpEditBootstrapPathControl.enable();
    this._editBootstrapClassNameControl.enable();
  }

  public onEjpUpdate():void {
    this.initBootstrapListModel();
    this.resetForm();
  }

  public createBootstrapFile():void {
    const fileInfo:BootstrapFileInfo = new BootstrapFileInfo();
    const bootstrapCfg:EjpBootstrapConfig[] = this.__ejpModel.webapp.bootstrap;
    const props:ClassPathProperties =
      this._classPathUtils.createClassPathProperties(
        this._editBootstrapClassNameControl.value,
        this._ejpEditBootstrapPathControl.value
      );
    let fileCfg:EjpBootstrapConfig = null;
    fileInfo.path = props.classPath;
    fileInfo.className = props.className;
    fileInfo.ejpDirectory = this.ejpDirectory;
    fileInfo.priority = this._ejpEditBootstrapPriorityControl.value;
    if(this._bootstrapUpdateSubscriber) this._bootstrapUpdateSubscriber.unsubscribe();
    this._bootstrapUpdateSubscriber = this._bootstrapService.create(fileInfo).subscribe(
      data => {
        this.__messagingService.push(
          ConsoleMessage.buildMessage("success", "Bootstrap class created")
        );
        this._bootstrapUpdateSubscriber.unsubscribe();
        fileCfg = {
          path: props.fullPath,
          priority: fileInfo.priority
        };
        bootstrapCfg.push(fileCfg);
        this.updateEjp();
      },
      err => {
        this.__dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "File creation error",
          "An error occured while creating the bootstrap class.<br/>You must restart the application."
        ));
        console.log(err);
      }
    );
  }

  public updateBootstrapFile():void {
    const bootstrapCfg:EjpBootstrapConfig[] = this.__ejpModel.webapp.bootstrap;
    const bootstrapId:number = bootstrapCfg.indexOf(this.selectedBootstrap);
    const fileCfg:EjpBootstrapConfig = {
      path: this.selectedBootstrap.path,
      priority: this._ejpEditBootstrapPriorityControl.value
    };
    bootstrapCfg.splice(bootstrapId, 1, fileCfg);
    this.updateEjp();
  }

  public deleteBootstrapFile():void {
    const bootstrapCfg:EjpBootstrapConfig[] = this.__ejpModel.webapp.bootstrap;
    const bootstrapId:number = bootstrapCfg.indexOf(this.selectedBootstrap);
    bootstrapCfg.splice(bootstrapId, 1);
    this.updateEjp();
  }

  protected initBreadcrumb():void {
    const dirPath:string = this.SLASH + this.ejpDirectory;
    this.__breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", [this.SLASH]),
      ConsoleMenuItem.buildItem("EJPs"),
      ConsoleMenuItem.buildItem(this.ejpDirectory, [dirPath]),
      ConsoleMenuItem.buildItem("Context properties", [dirPath + '/context']),
      ConsoleMenuItem.buildItem("Bootstrap files manager", [dirPath + "/context/bootstrap-files-manager"])
    ]);
  }

  private _ejpEditBootstrapPathControl:FormControl = null;
  private _ejpEditBootstrapPriorityControl:FormControl = null;
  private _bootstrapUpdateSubscriber:Subscription = null;
  private _editBootstrapClassNameControl:FormControl = null;
  private _classPathUtils:ClassPathUtils = null;
  
  private initBootstrapListModel():void {
    const webapp:EjpWebAppConfig = this.__ejpModel.webapp;
    const bootstrapCfg:EjpBootstrapConfig[] = webapp.bootstrap;
    let fileCfg:EjpBootstrapConfig = null;
    if(this.bootstrapListModel) this.bootstrapListModel.splice(0);
    if(bootstrapCfg) {
      const configModel:SelectItem[] = new Array<SelectItem>();
      let len:number = bootstrapCfg.length;
      while(len--) {
        fileCfg = bootstrapCfg[len];
        configModel.push(
          {label:fileCfg.path, value:fileCfg}
        )
      }
      this.bootstrapListModel = configModel;
    }
  }
}