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

@Injectable()
export class LocaleService {

  constructor (private _http:Http) {}

  private _localesObservable:Observable<string[]> = null;
  private _locales:string[] = null;

  public getLocaleList():Observable<string[]> {
    let result:Observable<string[]> = null;
    if(this._locales) result = Observable.of(this._locales);
    else if(this._localesObservable) {
      result = this._localesObservable;
    } else {
      this._localesObservable =
        this._http.get("./data/locale").map(
          (res:Response) => {
            this._locales = res.json();
            return this._locales;
          }
        );
      result = this._localesObservable;
    }
    return result;
  }
}