import express, {Express} from "express";
import LoggerServerApi from "../../services/logger/loggerServerApi";


export enum ApiParams {
   email = "email",
   password = "password"
}


export interface ManagerApiParamsConfigs {

}


export default class ManagerApiParams {
   private readonly app: Express;
   private readonly configs: ManagerApiParamsConfigs;


   constructor(configs: ManagerApiParamsConfigs) {
      this.app = express();
      this.configs = configs;

      this.app.on("mount", async () => {
         await LoggerServerApi.AddLog("INFO", `Manager api params is up and running`);
      });
   }


   public async Boot() {
      await this.Email();
   }

   public async GetApp() {
      return this.app;
   }


   private async Email() {
      this.app.param(ApiParams.email, () => {

      });
   }

   private async Password() {
      this.app.param(ApiParams.password, () => {

      });
   }
}
