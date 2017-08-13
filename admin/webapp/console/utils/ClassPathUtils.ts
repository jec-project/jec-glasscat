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

export class ClassPathProperties {

  constructor(){}

  public classPath:string =null;

  public className:string = null;

  public fullPath:string = null;
}

export class ClassPathUtils {

  constructor(){}
 
  public getClassPathProperties(rawPath:string):ClassPathProperties {
    let properties:ClassPathProperties = new ClassPathProperties();
    properties.fullPath = rawPath;
    let path:string = rawPath;
    let className:string = this.EMPTY_STRING;
    let slashId:number = -1;
    slashId = path.lastIndexOf(this.SLASH);
    if(slashId === -1) {
      className = path.substring(0, path.length);
      path = this.EMPTY_STRING;
    } else {
      className = path.substring(slashId + 1, path.length);
      path = path.substring(0, slashId);
    }
    properties.className = className;
    properties.classPath = path;
    return properties;
  }

  public createClassPathProperties(rawClassName:string, rawPath:string):ClassPathProperties {
    let properties:ClassPathProperties = new ClassPathProperties();
    let path:string = rawPath;
    let slashId:number = path.lastIndexOf(this.SLASH);
    if(slashId === path.length - 1) {
      path = path.substring(0, slashId);
    }
    properties.fullPath = path !== this.EMPTY_STRING ?
                          path + this.SLASH + rawClassName : rawClassName;
    properties.classPath = path;
    properties.className = rawClassName;
    return properties;
  }

  private readonly SLASH:string = "/";
  private readonly EMPTY_STRING:string = "";
}