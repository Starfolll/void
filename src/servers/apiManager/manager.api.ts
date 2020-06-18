import express, {Express} from "express";
import helmet from "helmet";
import ManagerApiRoutes, {ManagerApiRoutesConfigs} from "./manager.api.routes";
import LoggerServerApi from "../../services/logger/loggerServerApi";
import ManagerApiParams, {ManagerApiParamsConfigs} from "./manager.api.params";


interface ManagerApiConfigs {
   port: number;
   apiPath: string;
   routes: ManagerApiRoutesConfigs;
   params: ManagerApiParamsConfigs;
}


export default class ManagerApi {
   private readonly app: Express;
   private readonly managerApiConfigs: ManagerApiConfigs;

   private readonly params: ManagerApiParams;
   private readonly routes: ManagerApiRoutes;


   constructor(configs: ManagerApiConfigs) {
      this.app = express();
      this.managerApiConfigs = configs;

      this.params = new ManagerApiParams(configs.params);
      this.routes = new ManagerApiRoutes(configs.routes);
   }


   public async Setup() {
      await this.SetupUtils();

      await this.params.Boot();
      await this.routes.Boot();
   }

   private async SetupUtils() {
      await this.app.use(express.json());
   }


   public async UseHelmet() {
      await this.app.use(helmet());
   }

   public async UsePathLogger() {
      await this.app.use(async (req, res, next) => {
         await LoggerServerApi.AddLog("TRACE", `${req.ip} | ${req.originalUrl}`);
         next();
      });
   }


   public async Boot() {
      this.app.use(await this.params.GetApp());
      this.app.use(await this.routes.GetApp());

      this.app.listen(this.managerApiConfigs.port, () => LoggerServerApi.AddLog("INFO",
         `API server is listening on port ${this.managerApiConfigs.port}`
      ));
   }
}
