import RoutesApiCluster, {ApiResponse, ApiRouteConfigs, ApiRoutesConfigs} from "./routes.apiCluster";
import DbQueriesLobby from "../../../../db/queries/DbQueries.lobby";
import fetch from "node-fetch";
import {body} from "express-validator";
import ValidateApi from "../validation/validate.api";
import Logger from "../../../services/logger/logger";
import {LogType} from "../../../services/logger/components/log";
import Env from "../../../../env/env";


export namespace ApiClusterLobby {
   export type ApiClusterLobbyRoutes = {
      createLobby: ApiRouteConfigs;
   }

   export type ApiClusterLobbyConfigs = {}


   export class RoutesApiClusterLobby extends RoutesApiCluster<ApiClusterLobbyRoutes, keyof ApiClusterLobbyRoutes, apiResponseUser> {
      private readonly configs: ApiClusterLobbyConfigs;


      constructor(routes: ApiRoutesConfigs<ApiClusterLobbyRoutes>, configs: ApiClusterLobbyConfigs) {
         super(routes);
         this.configs = configs;
      }


      public async BindApi() {
         await this.CreateLobby();


         await this.LogApiRoutes();
      }


      private async CreateLobby() {
         const path = this.GetPath("createLobby");

         this.app.post(path, [
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.lobby.ValidateLobbyId(v))),
         ]);

         this.app.post(path, async (req, res) => {
            const lobbyId = req.body[ValidateApi.lobby.keys.lobbyId];

            await DbQueriesLobby.Create({
               id: lobbyId,
               status: "BOOTING"
            });

            await Logger.SendLog({
               data: `new lobby [${lobbyId}]`,
               type: LogType.INFO,
               serverId: Env.managers.apiManager.serverId
            })

            await this.Response(res, {
               responseName: "API_RESPONSE_CREATE_LOBBY",
               response: {
                  data: {lobbyId} as ApiResponseCreateLobby
               }
            });
         });
      }
   }


   export interface ApiResponseCreateLobby {
      lobbyId: string;
   }

   const API_RESPONSE_CREATE_LOBBY = "API_RESPONSE_CREATE_LOBBY";

   export type apiResponseUser = ApiResponse<typeof API_RESPONSE_CREATE_LOBBY, ApiResponseCreateLobby>;


   export class Request {
      public static async CreateLobby(lobbyId: string): Promise<ApiResponseCreateLobby> {
         return await (await fetch(`http://localhost:${Env.managers.apiManager.port}/api/lobby/createLobby/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({lobbyId})
         })).json() as ApiResponseCreateLobby;
      }
   }
}
