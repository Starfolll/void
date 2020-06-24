import express, {Express} from "express";
import helmet from "helmet";
import ManagerApiRoutes, {ManagerApiRoutesConfigs} from "./manager.api.routes";
import LoggerServerApi from "../../services/logger/loggerServerApi";
import ManagerApiParams, {ManagerApiParamsConfigs} from "./manager.api.params";
import {LogType} from "../../services/logger/components/log";
import Manager from "../../utils/manager/manager";
import Env from "../../../env/env";


interface ManagerApiConfigs {
   port: number;
   apiPath: string;
   routes: ManagerApiRoutesConfigs;
   params: ManagerApiParamsConfigs;
}


export default class ManagerApi extends Manager<ManagerApiConfigs> {
   private readonly app: Express;

   private readonly params: ManagerApiParams;
   private readonly routes: ManagerApiRoutes;


   constructor(configs: ManagerApiConfigs) {
      super(configs);

      this.app = express();
      this.params = new ManagerApiParams(this.configs.params);
      this.routes = new ManagerApiRoutes(this.configs.routes);
   }


   public async Setup() {
      await this.SetupUtils();

      await this.params.Boot();
      await this.routes.Boot();
   }

   private async SetupUtils() {
      await this.app.use(express.json());
      await this.UseHelmet();
      await this.UsePathLogger();
   }


   private async UseHelmet() {
      await this.app.use(helmet());
   }

   private async UsePathLogger() {
      await this.app.use(async (req, res, next) => {
         await LoggerServerApi.SendLog({
            type: LogType.INFO,
            serverId: Env.managers.apiManager.serverId,
            data: `server request : [method: ${req.method}, id: ${req.ip}, url: ${req.url}]`
         });

         next();
      });
   }


   public async Boot() {
      await this.params.Setup(this.app);
      await this.routes.Setup(this.app);

      this.app.listen(this.configs.port, () => LoggerServerApi.SendLog({
         type: LogType.INFO,
         serverId: Env.managers.apiManager.serverId,
         data: `${Env.upAndRunningMessage} [port: ${this.configs.port}]`
      }));
   }
}
