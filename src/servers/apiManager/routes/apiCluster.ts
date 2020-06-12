import express, {Express} from "express";


export interface ApiRouteConfigs {
   readonly path: string;
}


export interface ApiRoutesConfigs<RoutesConfigs> {
   readonly apiPath: string;
   readonly clusterPath: string;
   readonly routesConfigs: RoutesConfigs;
}


export default abstract class ApiCluster<T extends { [route: string]: ApiRouteConfigs }, K extends keyof T> implements ApiRoutesConfigs<T> {
   protected readonly app: Express;

   public readonly apiPath: string;
   public readonly clusterPath: string;
   public readonly routesConfigs: T;


   protected constructor(configs: ApiRoutesConfigs<T>) {
      this.app = express();

      this.apiPath = configs.apiPath;
      this.clusterPath = configs.clusterPath;
      this.routesConfigs = configs.routesConfigs;
   }


   public GetPath(name: K) {
      return `${this.apiPath}${this.clusterPath}${this.routesConfigs[name]}`;
   }


   public async abstract BindApi(): Promise<void>;

   public GetApp(): Express {
      return this.app;
   }
}
