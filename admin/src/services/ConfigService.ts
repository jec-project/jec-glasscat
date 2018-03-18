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

declare const process:any;

@WebJslet({
  name: "ConfigService",
  urlPatterns: ["/console/data/config"]
})
export class ConfigService extends HttpJslet {
  
  /*private readonly BRACE_O:RegExp = /\{/gmi;
  private readonly ESCAPED_BRACE_O:string = "&#123;";
  private readonly BRACE_C:RegExp = /\}/gmi;
  private readonly ESCAPED_BRACE_C:string = "&#125;";
  private readonly SEMICOLON:RegExp = /;/gmi;
  private readonly ESCAPED_SEMICOLON:string = ";<br/>";*/

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    const rawRelease:any = process.release;
    const release:any[] = [];
    const config:any[] = [];
    let rawConfig:any = process.config.target_defaults;
    let val:string = null;
    for(let key in rawConfig) {
      val = rawConfig[key];
      config.push( { name:key, value:val, type:"target_defaults" } );
    }
    rawConfig = process.config.variables;
    for(let key in rawConfig) {
      val = rawConfig[key];
      config.push( { name:key, value:val, type:"variables" } );
    }
    Object.keys(rawRelease).forEach(function(key) {
      val = rawRelease[key];
      release.push( { name:key, value:val } );
    });
    exit(req, res.send({ release:release, config:config }), null);
  }
}
