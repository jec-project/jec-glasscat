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
import {HttpStatusCode} from "jec-commons";
import {GpmServiceConfigLoader} from "../utils/GpmServiceConfigLoader";

@WebJslet({
  name: "GpmService",
  urlPatterns: ["/console/data/gpm"]
})
export class GpmService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {
    this._configLoader = new GpmServiceConfigLoader();
  }

  /**
   * The path to the GPM configuration file.
   * 
   * @attribute GPM_FILE_PATH
   * @private
   * @static
   * @final
   * @type String
   */
  private static readonly GPM_FILE_PATH:string =
                                         "${root}/public/wildcat/manifest.json";

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    this._configLoader.loadGpmConfig(
      GpmService.GPM_FILE_PATH,
      (data:any)=> {
        exit(req, res.send(data.models));
      },
      (err:any)=> {
        exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
      }
    );
  }
  
  private _configLoader:GpmServiceConfigLoader = null;
}
