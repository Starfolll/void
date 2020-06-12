import ManagerApi from "./manager.api";
import Env from "../../../env/env";


(async () => {
   const apiPath = "/api";
   const clustersPath = {
      user: "/user"
   };

   const managerApi = new ManagerApi({
      port: Env.managers.apiManager.apiPort,
      apiPath: "/api",
      params: {},
      routes: {
         user: {
            routes: {
               apiPath, clusterPath: clustersPath.user, routesConfigs: {
                  login: {path: "login"}
               }
            },
            configs: {}
         }
      }
   });

   await managerApi.Setup();
   await managerApi.Boot();
})();
