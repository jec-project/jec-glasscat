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

import {EjpsRoutingModule} from "./EjpsRoutingModule";

// Services imports:
import {EjpService} from '../services/EjpService';
import {BootstrapService} from '../services/BootstrapService';
import {JsletService} from '../services/JsletService';
import {RoleService} from '../services/RoleService';

// Components imports:
import {EjpsComponent} from "../components/ejps/EjpsComponent";
import {EjpGeneralComponent} from "../components/ejps/EjpGeneralComponent";
import {EjpContextComponent} from "../components/ejps/EjpContextComponent";
import {EjpJsletsComponent} from "../components/ejps/EjpJsletsComponent";
import {EjpCreateJsletComponent} from "../components/ejps/EjpCreateJsletComponent";
import {EjpBootstrapComponent} from "../components/ejps/EjpBootstrapComponent";
import {EjpSessionComponent} from "../components/ejps/EjpSessionComponent";
import {EjpResourceMapComponent} from "../components/ejps/EjpResourceMapComponent";
import {EjpLoginComponent} from "../components/ejps/EjpLoginComponent";
import {EjpConstraintsComponent} from "../components/ejps/EjpConstraintsComponent";
import {EjpRolesComponent} from "../components/ejps/EjpRolesComponent";
import {EjpStaticResourcesComponent} from "../components/ejps/EjpStaticResourcesComponent";

// Primeng imports:
import {PanelModule} from "primeng/components/panel/panel";
import {CheckboxModule} from "primeng/components/checkbox/checkbox";
import {ButtonModule} from "primeng/components/button/button";
import {InplaceModule} from "primeng/components/inplace/inplace";
import {InputTextModule} from "primeng/components/inputtext/inputtext";
import {InputTextareaModule} from "primeng/components/inputtextarea/inputtextarea";
import {DataTableModule} from "primeng/components/datatable/datatable";
import {DropdownModule} from "primeng/components/dropdown/dropdown";
import {SharedModule} from "primeng/components/common/shared";
import {ListboxModule} from "primeng/components/listbox/listbox";
import {TabMenuModule} from "primeng/components/tabmenu/tabmenu";
import {SpinnerModule} from "primeng/components/spinner/spinner";
import {SelectButtonModule} from "primeng/components/selectbutton/selectbutton"

@NgModule({
  imports: [
    CommonModule,
    EjpsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Primeng modules:
    DropdownModule,
    PanelModule,
    ButtonModule,
    InplaceModule,
    InputTextModule,
    InputTextareaModule,
    DataTableModule,
    SharedModule,
    ListboxModule,
    TabMenuModule,
    SpinnerModule,
    SelectButtonModule,
    CheckboxModule
  ],
  providers: [
    EjpService,
    BootstrapService,
    JsletService,
    RoleService
  ],
  declarations: [
    EjpsComponent,
    EjpGeneralComponent,
    EjpContextComponent,
    EjpJsletsComponent,
    EjpCreateJsletComponent,
    EjpBootstrapComponent,
    EjpSessionComponent,
    EjpResourceMapComponent,
    EjpLoginComponent,
    EjpConstraintsComponent,
    EjpRolesComponent,
    EjpStaticResourcesComponent
  ]
})
export class EjpsModule {}