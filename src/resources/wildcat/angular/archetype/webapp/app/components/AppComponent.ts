import {Component, OnInit} from "@angular/core";
import {MessageService} from "../services/MessageService";

/**
 * The Angular App entry point of your project.
 * 
 * @class  AppComponent
 * @constructor
 * @implements OnInit
 */
@Component({
  selector: "app-main",
  templateUrl: "./templates/app-main.html"
})
export class AppComponent implements OnInit {

  /*
   * Constructor function
   */
  constructor(private _messageService:MessageService) {}

  /**
   * @override
   */
  public ngOnInit():void {
    // TODO Auto-generated method stub
  }
}