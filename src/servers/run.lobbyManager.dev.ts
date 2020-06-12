import logInfo from "./utils/consoleLogs/logInfo";
import GlobalLobbyManager from "./globalLobbyManager/globalLobbyManager";
import WebSocket from "ws";
import GlobalLobby from "./globalLobbyManager/globalLobby";
import DB_Lobbies from "../../db/queries/DbQueries.lobby";
import {prisma} from "../../generated/prisma-client";


export default class GlobalLobbyManagerServerDev {
   private lobbyManager: GlobalLobbyManager | undefined;

   private readonly lobbyManagerWSPort: number;

   constructor() {
      this.lobbyManagerWSPort = +process.env.PUBLIC_GLOBAL_LOBBY_WS_PORT!;

      const r = async () => {
         logInfo("Mode: LOBBY MANAGER");
         logInfo(`Server version: ${process.env.npm_package_version}`);

         await prisma.deleteManyRooms();
         await prisma.deleteManyLobbies();

         this.lobbyManager = new GlobalLobbyManager(
            new WebSocket.Server({
               port: this.lobbyManagerWSPort
            }),
            new GlobalLobby(
               await DB_Lobbies.CreateNewLobby({name: "global 1"}),
               10
            )
         )
      };

      r().then(r => r);
   }
}
