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

import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {ProjectListItem} from "../business/ProjectListItem";

@Injectable()
export class WorkspaceService {

  constructor (private _http:Http) {}

  public getWorkspaceLocation():Observable<string> {
    return this._http.get("./data/workspace/location").map((res:Response) => {
      return decodeURIComponent(res.text());
    });
  }

  public getWorkspaceProjects():Observable<ProjectListItem[]> {
    return this._http.get("./data/workspace/projects").map((res:Response) => {
      return res.json();
    });
  }
}