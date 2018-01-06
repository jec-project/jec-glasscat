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
import {DomainsComponent} from "../components/domains/DomainsComponent";
import {DomainEditComponent} from "../components/domains/DomainEditComponent";
import {DomainLoadComponent} from "../components/domains/DomainLoadComponent";
import {DomainWizardComponent} from "../components/domains/DomainWizardComponent";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: DomainsComponent },
      { path: "edit/:id", component: DomainEditComponent },
      { path: "load/:id", component: DomainLoadComponent },
      { path: "wizard", component: DomainWizardComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DomainsRoutingModule {}