import express, {Express} from "express";
import {ApiRoutesConfigs} from "./routes/routes.apiCluster";
import Manager from "../../utils/manager/manager";
import {ApiClusterUser} from "./routes/routes.apiCluster.user";
import {ApiClusterLobby} from "./routes/routes.apiCluster.lobby";
import RoutesApiClusterUser = ApiClusterUser.RoutesApiClusterUser;
import RoutesApiClusterLobby = ApiClusterLobby.RoutesApiClusterLobby;


export interface ManagerApiRoutesConfigs {
   user: {
      routes: ApiRoutesConfigs<ApiClusterUser.ApiClusterUserRoutes>,
      configs: ApiClusterUser.ApiClusterUserConfigs
   };

   lobby: {
      routes: ApiRoutesConfigs<ApiClusterLobby.ApiClusterLobbyRoutes>,
      configs: ApiClusterLobby.ApiClusterLobbyConfigs
   };
}


export default class ManagerApiRoutes extends Manager<ManagerApiRoutesConfigs> {
   private readonly app: Express;
   private readonly ApiUser: RoutesApiClusterUser;
   private readonly ApiLobby: RoutesApiClusterLobby;


   constructor(configs: ManagerApiRoutesConfigs) {
      super(configs);

      this.ApiUser = new RoutesApiClusterUser(this.configs.user.routes, this.configs.user.configs);
      this.ApiLobby = new RoutesApiClusterLobby(this.configs.lobby.routes, this.configs.user.configs);

      this.app = express();
   }


   public async Boot() {
      await this.ApiLobby.BindApi();
      await this.ApiUser.BindApi();
   }

   public async Setup(app: Express) {
      app.use(await this.ApiUser.GetApp());
      app.use(await this.ApiLobby.GetApp());
   }
}
