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

import {NgModule,Component,AfterViewInit,AfterViewChecked,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomHandler} from 'primeng/components/dom/domhandler';

@Component({
    selector: 'p-terminal',
    template: `
        <div [ngClass]="'ui-terminal ui-widget ui-widget-content ui-corner-all'" [ngStyle]="style" [class]="styleClass" (click)="focus(in)">
            <div *ngIf="welcomeMessage" [innerHTML]="welcomeMessage"></div>
            <div class="ui-terminal-content">
                <div *ngFor="let command of commands">
                    <span>{{prompt}}</span>
                    <span class="ui-terminal-command">{{command.text}}</span>
                    <div [innerHTML]="command.response"></div>
                </div>
            </div>
            <div>
                <span class="ui-terminal-content-prompt">{{prompt}}</span>
                <input #in type="text" [(ngModel)]="command" class="ui-terminal-input" autocomplete="off" (keydown)="handleCommand($event)" autofocus>
            </div>
        </div>
    `,
    providers: [DomHandler]
})
export class GlasscatTerminal implements AfterViewInit,AfterViewChecked {

    @Input() welcomeMessage: string;

    @Input() prompt: string;
        
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() responseChange: EventEmitter<any> = new EventEmitter();

    @Output() handler: EventEmitter<any> = new EventEmitter();
        
    commands: any[] = [];
    
    command: string;
    
    container: Element;
    
    commandProcessed: boolean;
    
    constructor(public el: ElementRef, public domHandler: DomHandler) {}
    
    ngAfterViewInit() {
        this.container = this.domHandler.find(this.el.nativeElement, '.ui-terminal')[0];
    }
    
    ngAfterViewChecked() {
        if(this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }
                
    @Input()
    set response(value: string) {
        if(value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }
    
    handleCommand(event: KeyboardEvent) {
        if(event.keyCode == 13) {
            this.commands.push({text: this.command});                    
            this.handler.emit({originalEvent: event, command: this.command});
            this.command = '';
        }
    }
    
    focus(element: HTMLElement) {
        element.focus();
    }
    
}

@NgModule({
    imports: [CommonModule,FormsModule],
    exports: [GlasscatTerminal],
    declarations: [GlasscatTerminal]
})
export class GlasscatTerminalModule { }