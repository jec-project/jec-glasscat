import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {HttpStatusCode} from "jec-commons";

/**
 * Glasscat welcome jslet.
 */
@WebJslet({
  name: "WelcomeJslet",
  urlPatterns: ["/welcome"],
  template: "/views/welcome.ejs"
})
export class Welcome extends HttpJslet {
  
  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    exit(req, res, { sayHello: "GlassCat is alive!" });
  }
}
