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
import {HttpStatusCode, HttpHeader} from "jec-commons";
import {BootstrapConfig} from "jec-glasscat-config";
import {BootstrapConfigParser, GlassCatConfigLoader, GlassCatConfigUpdater} from "jec-glasscat-core";

@WebJslet({
  name: "ContextService",
  urlPatterns: ["/console/data/context"]
})
export class ContextService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {
    this._glassCatConfigLoader = new GlassCatConfigLoader();
    this._glassCatConfigUpdater = new GlassCatConfigUpdater();
  }

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    res.setHeader(HttpHeader.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
    let configParser:BootstrapConfigParser = null;
    let config:BootstrapConfig = null;

    this._glassCatConfigLoader.load(
      (data:any)=> {
        configParser = new BootstrapConfigParser();
        config = configParser.parse(data);
        exit(req, res.send(config));
      },
      (err:any)=> {
        exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
      }
    );
  }

  public doPut(req:HttpRequest, res:HttpResponse, exit:Function):void {
    this._glassCatConfigUpdater.update(
      req.getBody(),
      (err:any)=> {
        if(err) {
          exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
        } else {
          exit(req, res.sendStatus(HttpStatusCode.NO_CONTENT));
        }
      }
    );
  }
  
  private _glassCatConfigLoader:GlassCatConfigLoader = null;
  private _glassCatConfigUpdater:GlassCatConfigUpdater = null;
}
