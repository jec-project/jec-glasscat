import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

// Modules imports:
import {AppRoutingModule} from "./AppRoutingModule";

// Components imports:
import {AppComponent} from "../components/AppComponent";
import {WelcomeComponent} from "../components/WelcomeComponent";
import {ProjectStructureComponent} from "../components/ProjectStructureComponent";

// Singleton services imports:
import {MessageService} from "../services/MessageService";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    ProjectStructureComponent
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }