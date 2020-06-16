import express, {Express} from "express";
import {ApiParams} from "../manager.api.params";


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
   readonly apiPath: string;
   readonly clusterPath: string;
   readonly routesConfigs: RoutesConfigs;
}


enum statusCodes {
   validationError = 422,
   ok = 200
}


export default abstract class RoutesApiCluster<T extends { [route: string]: ApiRouteConfigs }, K extends keyof T, Res extends ApiResponse<string, any>> implements ApiRoutesConfigs<T> {
   protected readonly app: Express;
   protected readonly statusCodes = statusCodes;

   public readonly apiPath: string;
   public readonly clusterPath: string;
   public readonly routesConfigs: T;


   protected constructor(configs: ApiRoutesConfigs<T>) {
      this.app = express();

      this.apiPath = configs.apiPath;
      this.clusterPath = configs.clusterPath;
      this.routesConfigs = configs.routesConfigs;
   }


   protected GetParam(param: ApiParams) {
      return `/:${param}`;
   }

   protected GetPath(path: K) {
      return `${this.apiPath}${this.clusterPath}${this.routesConfigs[path]}`;
   }


   protected async abstract BindApi(): Promise<void>;

   protected GetApp() {
      return this.app;
   }


   protected GetErrorResponse(resName: string, error: apiResponseError, options?: { res: any, status: statusCodes }) {
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
