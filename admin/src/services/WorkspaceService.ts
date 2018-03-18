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

/// <reference path="../../../typings/index.d.ts" />
import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {HttpStatusCode} from "jec-commons";
import {EjpConfigLoader, Routes} from "jec-glasscat-core";
import * as fs from "fs";
import * as path from "path";
import {ProjectListItem} from "../../webapp/console/business/ProjectListItem";

@WebJslet({
  name: "WorkspaceService",
  urlPatterns: ["/console/data/workspace/*"]
})
@Routes([
  { name:"baseRoute", pattern:"/admin/console/data/workspace/location" },
  { name:"projectsRoute", pattern:"/admin/console/data/workspace/projects" }
])
export class WorkspaceService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {
    this._workspace = path.resolve("./workspace");
    this._loader = new EjpConfigLoader();
  }

  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    const url:string = req.getOriginalUrl();
    const result:ProjectListItem[] = new Array<any>();
    let tgt:string = null;
    let filesNum:number = 0;
    let webapp:any = null;
    switch(true) {
      case this.get("baseRoute").test(url) :
        exit(req, res.type('html').send(encodeURIComponent(this._workspace)));
        break;
      case this.get("projectsRoute").test(url) :
        fs.readdir(
          this._workspace,
          (err:NodeJS.ErrnoException, files:string[])=> {
            if(err) {
              exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
            } else {
              filesNum = files.length;
              files.forEach((value:string)=> {
                tgt = path.normalize(this._workspace + "/" + value);
                const project:ProjectListItem = new ProjectListItem();
                project.target = tgt;
                project.directory = value;
                result.push(project);
                this._loader.load(
                  tgt,
                  (data:any) => {
                    webapp = data.webapp;
                    project.name = webapp.name;
                    filesNum--;
                    if(filesNum === 0) exit(req, res.send(result));
                  },
                  (err:any) => {
                    project.invalid = true;
                    filesNum--;
                    if(filesNum === 0) exit(req, res.send(result));
                  }
                );
              });
              
            }
          }
        );
        break;
    }
  }

  private _workspace:string = null;
  private _loader:EjpConfigLoader = null;
}
