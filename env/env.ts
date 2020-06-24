import uniqid from "uniqid";


type deploymentEnv = "prod" | "dev";


const loggerServerWsPort = 8889;


export default class Env {
   public static readonly deployment: deploymentEnv = "dev";
   public static readonly upAndRunningMessage = "Up and running";

   public static readonly managers = {
      apiManager: {
         serverId: `manager/api/${uniqid()}`,
         apiPort: 8001,
         apiPath: "/api",
         commonTokenLength: 120
      },
   };

   public static readonly logger = {
      serverId: `logger/${uniqid()}`,
      ports: {
         loggerServerPort: 8888,
         loggerServerWsPort
      },
      wsServerUrl: `ws://localhost:${loggerServerWsPort}`
   }
}
