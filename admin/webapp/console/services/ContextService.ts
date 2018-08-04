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
import {BootstrapConfig} from "jec-glasscat-config";

@Injectable()
export class ContextService {

  constructor(private _http:Http) {}

  private _bootstrapConfigObservable:Observable<BootstrapConfig> = null;
  private _config:BootstrapConfig = null;

  public getContext():Observable<BootstrapConfig> {
    let result:Observable<BootstrapConfig> = null;
    if(this._config) result = Observable.of(this._config);
    else if(this._bootstrapConfigObservable) {
      result = this._bootstrapConfigObservable;
    } else {
      this._bootstrapConfigObservable =
        this._http.get("./data/context").map(
          (res:Response) => {
            this._config = res.json();
            return this._config;
          }
        );
      result = this._bootstrapConfigObservable;
    }
    return result;
  }

  public saveContext(config:BootstrapConfig):Observable<BootstrapConfig> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this._http.put("./data/context", config)
                     .map((res:Response) => {
                       this._config = config;
                       return this._config;
                     });
  }
}