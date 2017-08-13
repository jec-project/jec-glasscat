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

import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {EjpConfig} from "jec-glasscat-core";

@Injectable()
export class EjpService {

  constructor(private _http:Http) {
    this.initHeaderOptions();
  }

  public get(id:string):Observable<EjpConfig> {
    let result:Observable<EjpConfig> = null;
    if(this._currentId === id) {
      if(this._config) result = Observable.of(this._config);
      else if(this._ejpObservable) {
        result = this._ejpObservable;
      }
    } else {
      this._ejpObservable =
        this._http.get("./data/ejps/" + id).map(
          (res:Response) => {
            this._config = res.json();
            this._currentId = id;
            return this._config;
          }
        );
      result = this._ejpObservable;
    }
    return result;
  }

  public updateEjp(config:EjpConfig):Observable<Number> {
    return this._http.put("./data/ejps/" + this._currentId, config, this._requestOptions)
                     .map((res:Response) => {
                       this._config = config;
                       return 201;
                     });
  }

  private _currentId:string = null;
  private _config:EjpConfig = null;

  private _requestOptions:RequestOptions = null;

  private _ejpObservable:Observable<EjpConfig> = null;

  private initHeaderOptions():void {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this._requestOptions = new RequestOptions({ headers: headers });
  }
}