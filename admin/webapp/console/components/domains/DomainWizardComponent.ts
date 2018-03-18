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
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {GpmService} from "../../services/GpmService";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {MessagingService} from "../../services/messaging/MessagingService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";
import {DialogMessageService} from "../../services/messaging/DialogMessageService";
import {WaitingService} from "../../services/messaging/WaitingService";
import {ConsoleMessage} from "../../business/messaging/ConsoleMessage";
import {GpmInfo} from "../../business/GpmInfo";
import {SelectItem} from "primeng/components/common/api";
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: "app-domains",
  templateUrl: "./templates/domains/domain-wizard.html"
})
export class DomainWizardComponent implements OnInit, OnDestroy {

  constructor(private _gpmService:GpmService,
              private _breadcrumbService:BreadcrumbService,
              private _messagingService:MessagingService,
              private _dialogMessageService:DialogMessageService,
              private _router:Router,
              private _fb:FormBuilder,
              private _waitingService:WaitingService){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.init();
    this.loadModel();
  }

  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
  }

  public closeWizard():void {
    this._router.navigate(["/domains"]);
  }

  public projectModelSelected(e:any):void {
    this.selectedProject = e.value;
    this.showForm = this.selectedProject.name !== null;
  }

  public createProject():void {
    this._waitingService.push(true);
    const projectProperties:any = {
      gpm: this.selectedProject.target,
      projectName: this._projectName.value,
      directory: this._projectDirectory.value,
      contextRoot: this._projectContextRoot.value
    };
    this.extractAdditionalParams(projectProperties);
    if(this._newProjectSubscriber) this._newProjectSubscriber.unsubscribe();
    this._newProjectSubscriber = this._gpmService.buildProject(projectProperties).subscribe(
      data => {
        this._messagingService.push(
          ConsoleMessage.buildMessage(
            "success", "New project created",
            "List projects in workspace to see the new EJP."
          )
        );
        this._newProjectSubscriber.unsubscribe();
        this._waitingService.push(false);
        this.closeWizard();
      },
      err => {
        this._waitingService.push(false);
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Project creation error",
          "An error occured while creating the project.<br/>You must restart the application."
        ));
        console.log(err);
      }
    );
  }

  public modelList:SelectItem[] = null;
  public selectedModel:SelectItem = null;
  public selectedProject:GpmInfo = null;
  public showForm:boolean = false;

  public modelForm:FormGroup = null;
  
  private _subscriber:Subscription = null;
  private _newProjectSubscriber:Subscription = null;
  
  private _projectName:FormControl = null;
  private _projectDirectory:FormControl = null;
  private _projectContextRoot:FormControl = null;
  private _projectParameters:FormControl = null;
  private readonly PARAMS_PATTERN:RegExp = /-{2}\S*={1}\S*/g;
  private readonly EQUALS:string = "=";
  
  private init():void {
    this._projectName = new FormControl("", Validators.required);
    this._projectDirectory = new FormControl("", Validators.required);
    this._projectContextRoot = new FormControl("", Validators.required);
    this._projectParameters = new FormControl("");
    this.modelForm = this._fb.group({
      projectName: this._projectName,
      directory: this._projectDirectory,
      contextRoot: this._projectContextRoot,
      parameters: this._projectParameters
    });
  }

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ["/"]),
      ConsoleMenuItem.buildItem("Domains", ["/domains"]),
      ConsoleMenuItem.buildItem("Wizard", ["/domains/wizard"])
    ]);
  }

  private getEmptyModel():GpmInfo {
    return new GpmInfo();
  }

  private loadModel():void {
    const emptyModel:GpmInfo = this.getEmptyModel();
    this.selectedProject = emptyModel;
    this.modelList = new Array<SelectItem>();
    this.modelList.push( { label:"Select a project model", value:emptyModel } );
    this._subscriber = this._gpmService.getManifest().subscribe(
      data => {
        data.forEach((gpmInfo:GpmInfo)=> {
          this.modelList.push( { label:gpmInfo.name, value:gpmInfo } );
        });
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "GPM list initialization error",
          "An error occured while loading the GPM manifest file.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );
  }

  private extractAdditionalParams(projectProperties:any):void {
    const params:string = this._projectParameters.value;
    let result:RegExpMatchArray = null;
    let param:string = null;
    let key:string = null;
    let value:string = null;
    let splitter:number = -1;
    if(params !== "") {
      while(result = this.PARAMS_PATTERN.exec(params)) {
        param = result[0];
        splitter = param.indexOf(this.EQUALS);
        key = param.substr(2, splitter - 2);
        value = param.substring(splitter + 1);
        projectProperties[key] = value;
      }
    }
  }
}