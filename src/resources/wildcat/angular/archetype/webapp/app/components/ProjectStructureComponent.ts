import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/MessageService";

/**
 * The information view that describes the structure of the model.
 * 
 * @class  ProjectStructureComponent
 * @constructor
 * @implements OnInit
 */
@Component({
  selector: 'app-project-structure',
  templateUrl: "./templates/project-structure.html"
})
export class ProjectStructureComponent implements OnInit {

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