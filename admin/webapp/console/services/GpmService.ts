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
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {GpmInfo} from "../business/GpmInfo";

@Injectable()
export class GpmService {

  constructor(private _http:Http) {}

  private _gpmConfigObservable:Observable<GpmInfo[]> = null;
  private _config:GpmInfo[] = null;

  public getManifest():Observable<GpmInfo[]> {
    let result:Observable<GpmInfo[]> = null;
    if(this._config) result = Observable.of(this._config);
    else if(this._gpmConfigObservable) {
      result = this._gpmConfigObservable;
    } else {
      this._gpmConfigObservable =
        this._http.get("./data/gpm").map(
          (res:Response) => {
            this._config = res.json();
            return this._config;
          }
        );
      result = this._gpmConfigObservable;
    }
    return result;
  }
  
  public buildProject(projectProperties:any):Observable<number> {
    return this._http.post("./data/controllers/build-gpm", projectProperties)
                     .map((res:Response) => res.status);
  }
}