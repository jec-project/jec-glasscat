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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {DomainsRoutingModule} from "./DomainsRoutingModule";

// Services imports:
import {DomainsService} from '../services/DomainsService';
import {WorkspaceService} from '../services/WorkspaceService';
import {GpmService} from "../services/GpmService";

// Components imports:
import {DomainsComponent} from "../components/domains/DomainsComponent";
import {DomainEditComponent} from "../components/domains/DomainEditComponent";
import {DomainLoadComponent} from "../components/domains/DomainLoadComponent";
import {DomainWizardComponent} from "../components/domains/DomainWizardComponent";

// Primeng imports:
import {PanelModule} from "primeng/components/panel/panel";
import {ButtonModule} from "primeng/components/button/button";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {InputTextareaModule} from "primeng/components/inputtextarea/inputtextarea";
import {DataTableModule} from "primeng/components/datatable/datatable";
import {InplaceModule} from "primeng/components/inplace/inplace";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {SharedModule} from "primeng/components/common/shared";

@NgModule({
  imports: [
    CommonModule,
    DomainsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Primeng modules:
    DropdownModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DataTableModule,
    InplaceModule,
    SharedModule,
  ],
  providers: [
    DomainsService,
    WorkspaceService,
    GpmService
  ],
  declarations: [
    DomainsComponent,
    DomainEditComponent,
    DomainLoadComponent,
    DomainWizardComponent
  ]
})
export class DomainsModule {}