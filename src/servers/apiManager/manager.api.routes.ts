import RoutesApiClusterUser, {ApiClusterUserConfigs, ApiClusterUserRoutes} from "./routes/routes.apiCluster.user";
import express, {Express} from "express";
import {ApiRoutesConfigs} from "./routes/routes.apiCluster";
import LoggerServerApi from "../../services/logger/loggerServerApi";


export interface ManagerApiRoutesConfigs {
   user: {
      routes: ApiRoutesConfigs<ApiClusterUserRoutes>,
      configs: ApiClusterUserConfigs
   };
}


export default class ManagerApiRoutes {
   private readonly app: Express;
   private readonly configs: ManagerApiRoutesConfigs;


   private readonly ApiUser: RoutesApiClusterUser;


   constructor(configs: ManagerApiRoutesConfigs) {
      this.app = express();
      this.configs = configs;

      this.ApiUser = new RoutesApiClusterUser(this.configs.user.routes, this.configs.user.configs);

      this.app.on("mount", async () => {
         await LoggerServerApi.AddLog("INFO", `Manager api routes is up and running`);
      });
   }


   public async Boot() {
      this.app.use(this.ApiUser.GetApp());
   }

   public async GetApp() {
      return this.app;
   }
}
