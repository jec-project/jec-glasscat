//  DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
//
//   Copyright 2016-2017 Pascal ECHEMANN.
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
import {BootstrapFileInfo} from "../../webapp/console/business/EjpFileInfo";
import {CreateBootstrapFile} from "jec-glasscat-commands";
import {UrlUtils, LoggerManager} from "jec-glasscat-core";

@WebJslet({
  name: "BootstrapService",
  urlPatterns: ["/console/data/controllers/create-bootstrap-file"]
})
export class BootstrapService extends HttpJslet {

  public doPost(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let infoFile:BootstrapFileInfo = req.getBody();
    let priority:number = infoFile.priority;
    let command:CreateBootstrapFile = new CreateBootstrapFile();
    command.setLogger(LoggerManager.getInstance());
    let argv:any = {
      projectPath: infoFile.ejpDirectory,
      name: infoFile.className,
      path: infoFile.path,
      compile: true
    };
    if(priority) argv.priority = priority;
    command.execute(argv, (err:any)=> {
      if(err) {
        exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
      } else {
        exit(req, res.sendStatus(HttpStatusCode.CREATED));
      }
    });
  }
}
