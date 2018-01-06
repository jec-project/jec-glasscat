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
import {ConfigService} from "../../services/ConfigService";
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";

@Component({
  selector: 'app-config',
  templateUrl: "./templates/system/config.html",
  providers:[ConfigService]
})
export class ConfigComponent implements OnInit {

  constructor(private _configService:ConfigService,
              private _breadcrumbService:BreadcrumbService){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
    this.loadConfig();
  }

  private releaseModel:any[] = null;
  private propertiesModel:any[] = null;

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("System"),
      ConsoleMenuItem.buildItem("Config", ['/config'])
    ]);
  }

  private loadConfig():void {
    this._configService.getData().subscribe(
      data => {
        this.releaseModel = data.release;
        this.propertiesModel = data.config;
      },
      err => {
        console.error(err);
      }
    );
  }
  
}