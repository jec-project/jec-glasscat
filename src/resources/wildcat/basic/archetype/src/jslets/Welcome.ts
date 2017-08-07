import {HttpJslet} from "../../../../server/com/jec/commons/jslet/HttpJslet";
import {WebJslet} from "../../../../server/com/jec/commons/jslet/annotations/WebJslet";
import {HttpRequest} from "../../../../server/com/jec/commons/jslet/http/HttpRequest";
import {HttpResponse} from "../../../../server/com/jec/commons/jslet/http/HttpResponse";
import {HttpStatusCode} from "../../../../server/com/jec/commons/net/http/HttpStatusCode";

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
