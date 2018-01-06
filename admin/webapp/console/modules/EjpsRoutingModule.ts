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

import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

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

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ":id", component: EjpsComponent,
        children: [
        { path: "", redirectTo: "general", pathMatch: "full" },
        { path: "general", component: EjpGeneralComponent },
        { path: "context", component: EjpContextComponent },
        { path: "context/bootstrap-files-manager", component: EjpBootstrapComponent },
        { path: "jslets", component: EjpJsletsComponent },
        { path: "jslets/create", component: EjpCreateJsletComponent },
        { path: "session", component: EjpSessionComponent },
        { path: "resource-map", component: EjpResourceMapComponent },
        { path: "login", component: EjpLoginComponent },
        { path: "security/roles", component: EjpRolesComponent },
        { path: "security/constraints", component: EjpConstraintsComponent },
        { path: "security/resources", component: EjpStaticResourcesComponent }
      ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class EjpsRoutingModule {}