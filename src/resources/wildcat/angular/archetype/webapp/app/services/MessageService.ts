import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {ProjectListItem} from "../business/ProjectListItem";

@Injectable()
export class MessageService {

  constructor (private _http:Http) {}

  public getMessage():Observable<ProjectListItem[]> {
    return this._http.get("./message").map((res:Response) => {
      return res.json();
    });
  }
}