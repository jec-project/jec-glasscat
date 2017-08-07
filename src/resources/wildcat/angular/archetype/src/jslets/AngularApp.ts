import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {HttpStatusCode} from "jec-commons";

@WebJslet({
  name: "AngularApp",
  urlPatterns: [
    "/app",
    "/app/",
    "/app/welcome",
    "/app/project-structure/*",
    "/app/lazy-loading/*"
  ],
  template: "/views/angular-app.ejs"
})
export class AngularApp extends HttpJslet {
  
  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    exit(req, res);
  }
}
