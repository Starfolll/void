import RoutesApiClusterUser, {ApiClusterUserConfigs, ApiClusterUserRoutes} from "./routes/routes.apiCluster.user";
import express, {Express} from "express";
import {ApiRoutesConfigs} from "./routes/routes.apiCluster";
import LoggerServerApi from "../../services/logger/loggerServerApi";
import {LogType} from "../../services/logger/components/log";
import Manager from "../../utils/manager/manager";
import Env from "../../../env/env";


export interface ManagerApiRoutesConfigs {
   user: {
      routes: ApiRoutesConfigs<ApiClusterUserRoutes>,
      configs: ApiClusterUserConfigs
   };
}


export default class ManagerApiRoutes extends Manager<ManagerApiRoutesConfigs> {
   private readonly app: Express;
   private readonly ApiUser: RoutesApiClusterUser;


   constructor(configs: ManagerApiRoutesConfigs) {
      super(configs);

      this.ApiUser = new RoutesApiClusterUser(this.configs.user.routes, this.configs.user.configs);

      this.app = express();
      this.app.on("mount", async () => {
         await LoggerServerApi.SendLog({
            type: LogType.INFO,
            serverId: Env.managers.apiManager.serverId,
            data: `${Env.upAndRunningMessage} [manager api routes]`
         });
      });
   }


   public async Boot() {
      this.app.use(this.ApiUser.GetApp());
   }

   public async Setup(app: Express): Promise<void> {
      app.use(this.app);
   }
}
