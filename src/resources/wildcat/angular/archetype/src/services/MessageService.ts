import {HttpJslet, WebJslet, HttpRequest, HttpResponse} from "jec-exchange";
import {HttpStatusCode} from "jec-commons";

@WebJslet({
  name: "MessageService",
  urlPatterns: ["/app/message/*"]
})
export class MessageService extends HttpJslet {

  /**
   * @inheritDoc
   */
  public init():void {}

  /**
   * @inheritDoc
   */
  public doGet(req:HttpRequest, res:HttpResponse, exit:Function):void {
    exit(req, res.sendStatus(HttpStatusCode.OK));
  }
}
