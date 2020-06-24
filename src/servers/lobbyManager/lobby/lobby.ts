import WebSocket from "ws";
import WsCommunicator, {WsCommunicatorConfigs} from "../../../utils/wsHandlers/wsCommunicator";


export interface LobbyConfigs {

}


export default class Lobby extends WsCommunicator<any> {
   private readonly configs: LobbyConfigs;


   constructor(server: WebSocket.Server, configs: LobbyConfigs, wsCommunicatorConfigs: WsCommunicatorConfigs) {
      super(server, wsCommunicatorConfigs);

      this.configs = configs;
   }





   private OnUserConnect() {

   }
}
