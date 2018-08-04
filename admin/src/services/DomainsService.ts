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
import {DomainConfigLoader, DomainConfigUpdater, DomainConfigParser,
        EjpConfigLoader, Routes, DomainImpl, DomainConnectorConfigImpl} from "jec-glasscat-core";
import {Domain, DomainConfig, DomainConnectorConfig} from "jec-glasscat-config";
import {HttpStatusCode} from "jec-commons";
import * as path from "path";

@WebJslet({
  name: "DomainsService",
  urlPatterns: ["/console/data/domains/*"]
})
@Routes([
  { name:"baseRoute", pattern:"/admin/console/data/domains" },
  { name:"indexedRoute", pattern:"/admin/console/data/domains/:id" },
  { name:"loadRoute", pattern:"/admin/console/data/domains/load/:id" }
])
export class DomainsService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {
    this._domainConfigLoader = new DomainConfigLoader();
    this._domainConfigUpdater = new DomainConfigUpdater();
    this._workspace = path.resolve("./workspace");
    this._loader = new EjpConfigLoader();
    this._domainParser = new DomainConfigParser();
  }

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    const url:string = req.getOriginalUrl();
    let domainConfig:DomainConfig = null;
    let result:any = null;
    let target:string = null;
    switch(true) {
      case this.get("baseRoute").test(url) :
        this._domainConfigLoader.load(
          (data:any)=> {
            domainConfig = this._domainParser.parse(data);
            exit(req, res.send(domainConfig))
          },
          (err:any)=> exit(req, res.send(err))
        );
        break;
      case this.get("loadRoute").test(url) :
        result = this.get("loadRoute").exec(url);
        target = path.normalize(this._workspace + "/" + result.id);
        this._loader.load(
          target,
          (data:any) => {
            exit(req, res.send(this.buildDomain(data)));
          },
          (err:any) => {
            exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
          }
        );
        break;
      default:
        exit(req, res.sendStatus(HttpStatusCode.BAD_REQUEST));
    }
  }

  public doPut(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let domainConfig:DomainConfig = null;
    this.get("baseRoute").match(
      req.getOriginalUrl(),
      (result:any) => {
        domainConfig = this._domainParser.parse(req.getBody());
        this._domainConfigUpdater.update(
            domainConfig,
            (err:any)=> {
              if(err) exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
              else exit(req, res.sendStatus(HttpStatusCode.NO_CONTENT));
            }
          );
      },
      () => exit(req, res.sendStatus(HttpStatusCode.BAD_REQUEST))
    );
  }

  public doDelete(req:HttpRequest, res:HttpResponse, exit:Function):void {
    exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
  }

  private _domainConfigLoader:DomainConfigLoader = null;
  private _domainConfigUpdater:DomainConfigUpdater = null;
  private _domainParser:DomainConfigParser = null;
  private _workspace:string = null;
  private _loader:EjpConfigLoader = null;

  private buildDomain(data:any):Domain {
    const domain:Domain = new DomainImpl();
    domain.name = data.webapp.name;
    domain.connector = new DomainConnectorConfigImpl();
    return domain;
  }
}
