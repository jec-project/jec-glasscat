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

import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from "../../services/messaging/BreadcrumbService";
import {ConsoleMenuItem} from "../../business/messaging/ConsoleMenuItem";

@Component({
  selector: 'app-terminal',
  templateUrl: "./templates/terminal/terminal.html",
})
export class TerminalComponent implements OnInit {

  constructor(private _breadcrumbService:BreadcrumbService){}

  /**
   * @override
   */
  public ngOnInit():void {
    this.initBreadcrumb();
  }

  public response:string = null;

  public onCommand(event:any):void {
    let cmd:string = event.command;
    let node:any;
    switch(cmd) {
      case "clear" :
        node = window.document.querySelector(".ui-terminal-content");
        while(node.firstChild) {
          node.removeChild(node.firstChild);
        }
        break;
      case "test" :
        this.response = "test";
        break;
      default :
        this.response = 
`<div class="ui-terminal-error">
'${cmd}' is not recognized as an internal command.<br/><br/>
Usage: glasscat &lt;command&gt;<br/>
where &lt;command&gt is one of:<br/>
clear, help, start-server, version
<div>`;
    }
  }

  private initBreadcrumb():void {
    this._breadcrumbService.push([
      ConsoleMenuItem.buildItem("Console", ['/']),
      ConsoleMenuItem.buildItem("Terminal", ['/terminal'])
    ]);
  }
}