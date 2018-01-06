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

import {NgModule,Component,Input,AfterViewInit,OnDestroy,EventEmitter,ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from 'primeng/components/dom/domhandler';
import {BlockableUI} from 'primeng/components/common/api';

@Component({
    selector: 'p-blockUI',
    template: `
<div class="ui-blockui ui-widget-overlay" [ngClass]="{'ui-blockui-document':!target}" [ngStyle]="{display: blocked ? 'block' : 'none'}">
  <div id="blockuiContent">
    <i class="fa fa-spinner fa-pulse fa-5x"></i>
    <p>Please wait...</p>
  </div>
</div>
    `,
    providers: [DomHandler]
})
export class BlockUI implements AfterViewInit,OnDestroy {

    @Input() target: any;
    
    _blocked: boolean;
    
    _mask: HTMLDivElement;
    
    constructor(public el: ElementRef,public domHandler: DomHandler) {}
    
    @Input() get blocked(): boolean {
        return this._blocked;
    }
    
    set blocked(val: boolean) {
        this._blocked = val;
        
        if(this._mask) {
            if(this._blocked)
                this.block();
            else
                this.unblock();
        }
    }
    
    ngAfterViewInit() {
        this._mask = this.el.nativeElement.children[0];
        
        if(this.target && !this.target.getBlockableElement) {
            throw 'Target of BlockUI must implement BlockableUI interface';
        }
    }
        
    block() {
        if(this.target) {
            this.target.getBlockableElement().appendChild(this._mask);
            let style = this.target.style||{};
            style.position = 'relative';
            this.target.style = style;
        }
        else {
            document.body.appendChild(this._mask);
        }
        
        this._mask.style.zIndex = String(++DomHandler.zindex);
    }
    
    unblock() {
        this.el.nativeElement.appendChild(this._mask);
    }
    
    ngOnDestroy() {
        
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [BlockUI],
    declarations: [BlockUI]
})
export class BlockUIModule { }