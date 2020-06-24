import WsUser from "../../../../utils/wsHandlers/wsUser";
import WebSocket from "ws";


export default class LobbyUser extends WsUser<{}, {}, {}> {
   constructor(socket: WebSocket) {
      super(socket);
   }
}
