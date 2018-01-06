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

import {SystemRoutingModule} from "./SystemRoutingModule";

// Components imports:
import {ProcessesComponent} from "../components/system/ProcessesComponent";
import {EnvironmentComponent} from "../components/system/EnvironmentComponent";
import {ConfigComponent} from "../components/system/ConfigComponent";

// Primeng imports:
import {ButtonModule} from "primeng/components/button/button";
import {DataTableModule} from "primeng/components/datatable/datatable";
import {FieldsetModule} from "primeng/components/fieldset/fieldset";
import {PanelModule} from "primeng/components/panel/panel";
import {MenuModule} from "primeng/components/menu/menu";
import {SharedModule} from "primeng/components/common/shared";

@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
    // Primeng modules:
    ButtonModule,
    DataTableModule,
    FieldsetModule,
    PanelModule,
    MenuModule,
    SharedModule
  ],
  declarations: [
    ProcessesComponent,
    ConfigComponent,
    EnvironmentComponent
  ]
})
export class SystemModule {}