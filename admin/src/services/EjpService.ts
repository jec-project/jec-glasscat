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

import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {EjpConfigParser, EjpConfigLoader, EjpConfigUpdater, EjpConfig, Routes} from "jec-glasscat-core";
import {HttpStatusCode} from "jec-commons";
import * as fs from "fs";
import * as path from "path";


@WebJslet({
  name: "EjpService",
  urlPatterns: ["/console/data/ejps/*"]
})
@Routes([
  { name:"indexedRoute", pattern:"/admin/console/data/ejps/:id" }
])
export class EjpService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {
    this._loader = new EjpConfigLoader();
    this._ejpParser = new EjpConfigParser();
    this._ejpConfigUpdater = new EjpConfigUpdater();
  }

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let ejpConfig:EjpConfig = null;
    let url:string = req.getOriginalUrl();
    let result:any = null;
    let target:string = null;
    let dataId:string = null;
    let projectPath:string = null;
    this.get("indexedRoute").match(url,
      (data:any) => {
        dataId = data.id;
        projectPath = dataId === this.ADMIN_DIRECTORY ?
                      this.ADMIN_PATH : this.WORKSPACE_PATH + dataId;
        this._loader.load(projectPath,
          (ejp:any) => {
            ejpConfig = this._ejpParser.parse(ejp);
            exit(req, res.send(ejpConfig));
          },
          (err:any) => exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR))
        );
      },
      (err:any) => exit(req, res.sendStatus(HttpStatusCode.BAD_REQUEST))
    );
  }

  public doPut(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let ejpConfig:EjpConfig = null;
    let url:string = req.getOriginalUrl();
    let dataId:string = null;
    let projectPath:string = null;
    this.get("indexedRoute").match(url,
      (data:any) => {
        dataId = data.id;
        projectPath = dataId === this.ADMIN_DIRECTORY ?
                      this.ADMIN_PATH : this.WORKSPACE_PATH + dataId;
        ejpConfig = req.getBody() as EjpConfig;
        this._ejpConfigUpdater.update(projectPath, ejpConfig,
          (err:any) => {
            if(err) exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR))
            else exit(req, res.sendStatus(HttpStatusCode.CREATED));
          },
          true
        );
      },
      (err:any) => exit(req, res.sendStatus(HttpStatusCode.BAD_REQUEST))
    );
  }

  private _ejpConfigUpdater:EjpConfigUpdater = null;
  private _ejpParser:EjpConfigParser = null;
  private _workspace:string = null;
  private _loader:EjpConfigLoader = null;
  
  /**
   * The directory name of the GlassCat server admin application.
   * 
   * @attribute ADMIN_DIRECTORY
   * @private
   * @static
   * @final
   * @type String
   */
  private readonly ADMIN_DIRECTORY:string = "admin";
  
  /**
   * The path to the GlassCat server workspace.
   * 
   * @attribute WORKSPACE_PATH
   * @private
   * @static
   * @final
   * @type String
   */
  private readonly WORKSPACE_PATH:string = "${root}/workspace/";
  
  /**
   * The path to the GlassCat server admin application.
   * 
   * @attribute ADMIN_PATH
   * @private
   * @static
   * @final
   * @type String
   */
  private readonly ADMIN_PATH:string = "${root}/admin/";
}
