import WebSocket, {ServerOptions} from "ws";
import Manager from "../../utils/manager/manager";
import Lobby, {LobbyConfigs} from "./lobby/lobby";
import Logger from "../../services/logger/logger";
import Env from "../../../env/env";
import {LogType} from "../../services/logger/components/log";


export interface ManagerLobbyConfigs {
   server: ServerOptions;
   lobby: LobbyConfigs;
}


export default class ManagerLobby extends Manager<ManagerLobbyConfigs> {
   private readonly server: WebSocket.Server;
   private readonly lobby: Lobby;


   constructor(configs: ManagerLobbyConfigs) {
      super(configs);

      this.server = new WebSocket.Server(this.configs.server);
      this.lobby = new Lobby(this.server, this.configs.lobby, {});
   }


   public async Setup() {
      this.lobby.ApplyClientListeners();
      this.lobby.ApplyListeners();
   }

   public async Boot() {
      this.server.on("listening", async () => {
         await Logger.SendLog({
            serverId: Env.managers.apiManager.serverId,
            type: LogType.INFO,
            data: Env.upAndRunningMessage
         })
      });
   }
}
