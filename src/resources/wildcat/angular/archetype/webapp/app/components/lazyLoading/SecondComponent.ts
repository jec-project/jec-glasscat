import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from '@angular/router';
import {Subscription} from "rxjs/Rx";
import {MessageService} from "../../services/MessageService";
import {ProjectListItem} from "../../business/ProjectListItem";

@Component({
  selector: "app-lazy",
  templateUrl: "./templates/lazyLoading/second-component.html"
})
export class SecondComponent implements OnInit, OnDestroy {

  constructor(private _messageService:MessageService,
              private _router:Router){}

  /**
   * @override
   */
  public ngOnInit():void {
    
  }

  public ngOnDestroy():void {
    this._subscriber.unsubscribe();
    
  }

  private _subscriber:Subscription = null;
  
  private loadDomains():void {
    /*this._subscriber = this._domainService.getAll().subscribe(
      data => {
        this.domainListModel = data;
        this.domainNum = this.domainListModel.length;
      },
      err => {
        this._dialogMessageService.push(ConsoleMessage.buildMessage(
          "error", "Context initialization error",
          "An error occured while loading configuration files.<br/>You must restart the application."
        ));
        console.error(err);
      }
    );*/
  }
}