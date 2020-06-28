import express, {Express} from "express";
import {ApiParams} from "../manager.api.params";
import Logger from "../../../services/logger/logger";
import {LogType} from "../../../services/logger/components/log";
import Env from "../../../../env/env";


type apiResponseError = string | Array<any> | undefined;

export interface ApiResponse<ResName, ResData> {
   readonly responseName: ResName;
   readonly response: {
      readonly errors?: apiResponseError;
      readonly data?: ResData;
   };
}


export interface ApiRouteConfigs {
   readonly path: string;
}

export interface ApiRoutesConfigs<RoutesConfigs> {
   readonly path: string;
   readonly clusterPath: string;
   readonly routesConfigs: RoutesConfigs;
}


enum StatusCodes {
   validationError = 422,
}


export default abstract class RoutesApiCluster<T extends { [route: string]: ApiRouteConfigs }, K extends keyof T, Res extends ApiResponse<string, any>> implements ApiRoutesConfigs<T> {
   protected readonly app: Express;
   protected readonly statusCodes = StatusCodes;

   public readonly path: string;
   public readonly clusterPath: string;
   public readonly routesConfigs: T;


   protected constructor(configs: ApiRoutesConfigs<T>) {
      this.app = express();

      this.path = configs.path;
      this.clusterPath = configs.clusterPath;
      this.routesConfigs = configs.routesConfigs;
   }


   protected GetParam(param: ApiParams) {
      return `/:${param}`;
   }

   protected GetPath(path: K) {
      return `${this.path}${this.clusterPath}${this.routesConfigs[path].path}`;
   }


   protected async abstract BindApi(): Promise<void>;

   public async GetApp() {
      return this.app;
   }

   public async LogApiRoutes() {
      for (const route of this.app._router.stack) if (!!route.route && !!route.route.path) await Logger.SendLog({
         type: LogType.INFO,
         serverId: Env.managers.apiManager.serverId,
         data: `Api using route [${Object.keys(route.route.methods).join(", ")} => ${route.route.path}]`
      });
   }


   protected GetErrorResponse(resName: string, error: apiResponseError, options?: { res: any, status: StatusCodes }) {
      if (!!options) options.res.status(options.status);

      return {
         responseName: resName,
         response: {
            errors: error,
         }
      } as Res;
   }

   protected async Response(res: any, resData: Res) {
      await res.json(resData);
   }
}
