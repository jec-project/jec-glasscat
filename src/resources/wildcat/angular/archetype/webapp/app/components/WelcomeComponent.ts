import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/MessageService";

/**
 * The main view displayed in the Angular App.
 * 
 * @class  WelcomeComponent
 * @constructor
 * @implements OnInit
 */
@Component({
  selector: 'app-welcome',
  templateUrl: "./templates/welcome.html"
})
export class WelcomeComponent implements OnInit {

  /*
   * Constructor function
   */
  constructor(private _messageService:MessageService) {}

  /**
   * The message displayed in the Jumbotron component.
   * 
   * @attribute message
   * @type String
   * @default null
   */
  public message:string = null;

  /**
   * @override
   */
  public ngOnInit():void {
    // TODO Auto-generated method stub
  }
  
  /**
   * The message displayed in the Jumbotron component.
   * 
   * @method showAlert
   * @type String
   * @default null
   */
  public showAlert():void {
    this.message = "GlassCat is alive!";
  }
}