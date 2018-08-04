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
import {Domain, DomainConfig} from "jec-glasscat-config";

@Injectable()
export class DomainsService {

  constructor(private _http:Http) {
    this.initHeaderOptions();
  }

  public getAll():Observable<Domain[]> {
    let result:Observable<Domain[]> = null;
    if(this._domainList) result = Observable.of(this._domainList);
    else if(this._domainListObservable) {
      result = this._domainListObservable;
    } else {
      this._domainListObservable =
        this._http.get("./data/domains").map(
          (res:Response) => {
            this._domainConfig = res.json();
            this._domainList = this._domainConfig.domains;
            return this._domainList;
          }
        );
      result = this._domainListObservable;
    }
    return result;
  }

  public getDomain(id:string):Observable<Domain> {
    return this.getAll()
               .map(domain => domain.filter(domain => domain.name === id)[0]);
  }

  public loadDomain(id:string):Observable<Domain> {
    return this._http.get("./data/domains/load/" + id)
                     .map((res:Response) => res.json());
  }

  public addDomain(domain:Domain):Observable<Number> {
    const updatedDomainList:Domain[] = this._domainList.slice(0);
    updatedDomainList.push(domain);
   return this.updateDomainList(updatedDomainList);
  }

  public updateDomain(domain:Domain):Observable<Number> {
    const updatedDomainList:Domain[] = this._domainList.slice(0);
    const pos:number = this._domainList.indexOf(domain);
    updatedDomainList.splice(pos, 1, domain);
    return this.updateDomainList(updatedDomainList);
  }

  private updateDomainList(domainList:Domain[]):Observable<Number> {
    this._domainConfig.domains = domainList;
    return this._http.put("./data/domains", this._domainConfig, this._requestOptions)
                     .map((res:Response) => {
                       this._domainList = domainList;
                       return 201;
                     });
  }

  public unloadDomain(domain:Domain):Observable<Number> {
    const updatedDomainList:Domain[] = new Array<Domain>();
    const domainId:string = domain.name;
    let len:number = this._domainList.length;
    let registeredDomain:Domain = null;
    while(len--) {
      registeredDomain = this._domainList[len];
      if(registeredDomain.name !== domainId) {
        updatedDomainList.push(registeredDomain);
      }
    }
    return this.updateDomainList(updatedDomainList);
  }

  public deleteDomain(domain:Domain):Observable<Number> {
    /*let len:number = this._domainList.length;
    const updatedDomainList:Domain[] = new Array<Domain>();
    let registeredDomain:Domain = null;
    const domainId:string = domain.name;
    while(len--) {
      registeredDomain = this._domainList[len];
      if(registeredDomain.name !== domainId) {
        updatedDomainList.push(registeredDomain);
      }
    }
    this._domainConfig.domains = updatedDomainList;
    //TODO: use delete command:
    return this._http.put("./data/domains", this._domainConfig, this._requestOptions)
                     .map((res:Response) => {
                       this._domainList.splice(0);
                       this._domainList = updatedDomainList;
                       return 201;
                     });*/
    return null;
  }

  private _requestOptions:RequestOptions = null;

  private _domainListObservable:Observable<Domain[]> = null;
  private _loadedDomainObservable:Observable<Domain> = null;
  private _domainConfig:DomainConfig = null;
  private _domainList:Domain[] = null;

  private initHeaderOptions():void {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this._requestOptions = new RequestOptions({ headers: headers });
  }
}