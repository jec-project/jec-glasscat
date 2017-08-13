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

declare const process:any;

@WebJslet({
  name: "EnvironmentService",
  urlPatterns: ["/console/data/environment"]
})
export class EnvironmentService extends HttpJslet {
  
  private readonly BRACE_O:RegExp = /\{/gmi;
  private readonly ESCAPED_BRACE_O:string = "&#123;";
  private readonly BRACE_C:RegExp = /\}/gmi;
  private readonly ESCAPED_BRACE_C:string = "&#125;";
  private readonly SEMICOLON:RegExp = /;/gmi;
  private readonly ESCAPED_SEMICOLON:string = ";<br/>";

  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    let rawEnv:any = process.env;
    let env:any = {};
    let environment:any[] = [];
    let val:string;
    for(let key in rawEnv) {
      val = rawEnv[key];
      val = val.replace(this.BRACE_O, this.ESCAPED_BRACE_O)
               .replace(this.BRACE_C, this.ESCAPED_BRACE_C)
               .replace(this.SEMICOLON, this.ESCAPED_SEMICOLON);
      environment.push({ name:key, value:val });
    }
    exit(
      req,
      res.send({ env:environment, platform:process.platform, arch:process.arch }),
      null
    );
  }
}
