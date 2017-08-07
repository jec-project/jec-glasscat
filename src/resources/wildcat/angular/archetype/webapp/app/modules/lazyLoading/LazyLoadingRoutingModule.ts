import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

// Components imports:
import {FirstComponent} from "../../components/lazyLoading/FirstComponent";
import {SecondComponent} from "../../components/lazyLoading/SecondComponent";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: "", component: FirstComponent },
      { path: "first-component", component: FirstComponent },
      { path: "second-component", component: SecondComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LazyLoadingRoutingModule {}