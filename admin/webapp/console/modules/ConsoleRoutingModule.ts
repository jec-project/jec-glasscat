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
import {RouterModule} from '@angular/router';

// Components imports:
import {WelcomeComponent} from "../components/WelcomeComponent";

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: "", redirectTo: "welcome", pathMatch: 'full' },
      { path: "welcome", component: WelcomeComponent },
      { path: "domains", loadChildren: "modules/DomainsModule#DomainsModule" },
      { path: "ejps", loadChildren: "modules/EjpsModule#EjpsModule" },
      { path: "system", loadChildren: "modules/SystemModule#SystemModule" },
      { path: "configuration", loadChildren: "modules/ConfigurationModule#ConfigurationModule" },
      { path: "terminal", loadChildren: "modules/TerminalModule#TerminalModule" }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ConsoleRoutingModule {}