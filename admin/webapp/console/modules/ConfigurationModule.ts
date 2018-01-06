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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ConfigurationRoutingModule} from "./ConfigurationRoutingModule";

// Services imports:
import {LocaleService} from "../services/LocaleService";

// Components imports:
import {ServerConfigComponent} from "../components/configuration/ServerConfigComponent";
import {HttpTasksComponent} from "../components/configuration/HttpTasksComponent";
import {HttpTaskEditComponent} from "../components/configuration/HttpTaskEditComponent";
import {LoggersComponent} from "../components/configuration/LoggersComponent";
import {LoggerCreateComponent} from "../components/configuration/LoggerCreateComponent";
import {LoggerEditComponent} from "../components/configuration/LoggerEditComponent";
import {HttpTaskCreateComponent} from "../components/configuration/HttpTaskCreateComponent";
import {SecurityComponent} from "../components/configuration/SecurityComponent";
import {ModulesComponent} from "../components/configuration/ModulesComponent";

// Primeng imports:
import {ButtonModule} from "primeng/components/button/button";
import {FieldsetModule} from "primeng/components/fieldset/fieldset";
import {InputSwitchModule} from "primeng/components/inputswitch/inputswitch";
import {DataTableModule} from "primeng/components/datatable/datatable";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {InplaceModule} from "primeng/components/inplace/inplace";
import {PanelModule} from "primeng/components/panel/panel";
import {MenuModule} from "primeng/components/menu/menu";
import {SharedModule} from "primeng/components/common/shared";

@NgModule({
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Primeng modules:
    ButtonModule,
    FieldsetModule,
    InputSwitchModule,
    DataTableModule,
    DropdownModule,
    InputTextModule,
    InplaceModule,
    PanelModule,
    MenuModule,
    SharedModule
  ],
  providers: [
    LocaleService
  ],
  declarations: [
    ServerConfigComponent,
    LoggersComponent,
    LoggerCreateComponent,
    LoggerEditComponent,
    HttpTasksComponent,
    HttpTaskEditComponent,
    HttpTaskCreateComponent ,
    SecurityComponent,
    ModulesComponent
  ]
})
export class ConfigurationModule {}