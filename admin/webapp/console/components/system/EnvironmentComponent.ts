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

import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from "../../services/EnvironmentService";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";

@Component({
  selector: 'app-environment',
  templateUrl: "./templates/system/environment.html",
  providers: [EnvironmentService]
})
export class EnvironmentComponent implements OnInit {

  constructor(private _environmentService:EnvironmentService,
              private _breadcrumbService:BreadcrumbService){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.loadConfig();
  }

  private platform:string = null;
  private arch:string = null;
  private environmentModel:any[] = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("System"),
      ConsoleMenuItem.buildItem("Environment", ['/system/environment'])
    ]);
  }

  private loadConfig():void {
    this._environmentService.getData().subscribe(
      data => {
        this.environmentModel = data.env;
        this.platform = data.platform as string;
        this.arch = data.arch as string;
      },
      err => {
        console.error(err);
      }
    );
  }
}