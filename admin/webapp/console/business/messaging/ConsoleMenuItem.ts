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

import {EventEmitter} from '@angular/core';
import {MenuItem} from "primeng/components/common/api";

export class ConsoleMenuItem implements MenuItem {

  constructor(label:string, routerLink?:any, icon?:string){
    this.label = label;
    this.routerLink = routerLink;
    this.icon = icon;
  }

  public label:string = null;
  public icon:string = null;
  public routerLink:any = null;
  public command: (event?: any) => void;
  public url:string = null;
  public eventEmitter:EventEmitter<any> = null;
  public items:MenuItem[];
  public expanded:boolean = false;
  public disabled:boolean = false;

  public static buildItem(label:string, routerLink?:any, icon?:string):MenuItem{
    let msg:MenuItem = new ConsoleMenuItem(label, routerLink, icon);
    return msg;
  }
}