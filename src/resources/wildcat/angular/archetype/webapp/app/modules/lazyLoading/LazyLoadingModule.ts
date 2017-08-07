import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LazyLoadingRoutingModule} from "./LazyLoadingRoutingModule";

// Services imports:
import {MessageService} from '../../services/MessageService';

// Components imports:
import {FirstComponent} from "../../components/lazyLoading/FirstComponent";
import {SecondComponent} from "../../components/lazyLoading/SecondComponent";

@NgModule({
  imports: [
    CommonModule,
    LazyLoadingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService
  ],
  declarations: [
    FirstComponent,
    SecondComponent
  ]
})
export class DomainsModule {}