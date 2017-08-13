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
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/Rx';

@Injectable()
export class AbstractMessageService<T> {

  constructor() {
    this._messageListObservable = Observable.create(
      observer => {
        this._emitter = new MessagingServiceEmitter(observer);
      }
    );
  }

  private _messageListObservable:Observable<T> = null;
  private _emitter:MessagingServiceEmitter<T> = null;

  public getMessages():Observable<T> {
    return this._messageListObservable;
  }

  public push(message:T):void {
    this._emitter.emit(message);
  }
}

class MessagingServiceEmitter<T> {

  constructor(observer:Observer<T>){
    this._observer = observer;
  }

  private _observer:Observer<T> = null;

  public emit(message:T):void {
    this._observer.next(message);
  }
}