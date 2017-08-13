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

import {NgModule} from "@angular/core";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

// Modules imports:
import {ConsoleRoutingModule} from "./ConsoleRoutingModule";

// Primeng imports:
import {ButtonModule} from "primeng/components/button/button";
import {BreadcrumbModule} from "primeng/components/breadcrumb/breadcrumb";
import {MenuModule} from "primeng/components/menu/menu";
import {MessagesModule} from "primeng/components/messages/messages";
import {PanelModule} from "primeng/components/panel/panel";
import {PanelMenuModule} from "primeng/components/panelmenu/panelmenu";
import {SharedModule } from "primeng/components/common/shared";
import {ConfirmDialogModule} from "primeng/components/confirmdialog/confirmdialog";
import {DialogModule} from "primeng/components/dialog/dialog";
import {ConfirmationService} from "primeng/components/common/api";

// Primeng imports overrides:
import {BlockUIModule} from "../gui/blockui";

// Components imports:
import {ConsoleAppComponent} from "../components/ConsoleAppComponent";
import {WelcomeComponent} from "../components/WelcomeComponent";

// Singleton services imports:
import {MessagingService} from "../services/messaging/MessagingService";
import {BreadcrumbService} from "../services/messaging/BreadcrumbService";
import {ConfirmDialogMessageService} from "../services/messaging/ConfirmDialogMessageService";
import {DialogMessageService} from "../services/messaging/DialogMessageService";
import {ContextService} from "../services/ContextService";
import {WaitingService} from "../services/messaging/WaitingService";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ConsoleRoutingModule,
    // Primeng modules:
    ButtonModule,
    BlockUIModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    DialogModule,
    MenuModule,
    MessagesModule,
    PanelModule,
    PanelMenuModule,
    SharedModule
  ],
  declarations: [
    ConsoleAppComponent,
    WelcomeComponent
  ],
  providers: [
    MessagingService,
    BreadcrumbService,
    ConfirmDialogMessageService,
    ContextService,
    ConfirmationService,
    DialogMessageService,
    WaitingService
  ],
  bootstrap: [ConsoleAppComponent]
})
export class ConsoleAppModule { }