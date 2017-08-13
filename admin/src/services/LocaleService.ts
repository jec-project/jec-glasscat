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

/// <reference path="../../../typings/index.d.ts" />
import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {HttpStatusCode} from "jec-commons";
import * as fs from "fs";
import * as path from "path";

@WebJslet({
  name: "LocaleService",
  urlPatterns: ["/console/data/locale"]
})
export class LocaleService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let result:any[] = new Array<any>();
    let locale:string = null;
    fs.readdir(
      "./public/locales",
      (err:NodeJS.ErrnoException, files:string[])=> {
        if(err) {
          exit(req, res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR));
        } else {
          files.forEach((value:string)=> {
            locale = value.substring(0, value.length - 5);
            result.push({
              label: locale,
              value: locale
            });
          });
          exit(req, res.send(result));
        }
      }
    );
    
  }
}
