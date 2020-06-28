import ManagerLobby from "./manager.lobby";
import Logger from "../../services/logger/logger";
import {ApiClusterLobby} from "../apiManager/routes/routes.apiCluster.lobby";
import Env from "../../../env/env";


(async () => {
   await Logger.AwaitServer();
   await ApiClusterLobby.Request.CreateLobby(Env.managers.apiManager.serverId);

   const managerLobby = new ManagerLobby({
      server: {
         port: Env.managers.lobbyManager.wsPort
      },
      lobby: {}
   });

   await managerLobby.Setup();
   await managerLobby.Boot();
})();
