type deploymentEnv = "prod" | "dev";


export default class Env {
   public static readonly deployment: deploymentEnv = "dev";

   public static readonly managers = {
      apiManager: {
         apiPort: 8001
      }
   };

   public static readonly loggerServerPort = 8888;
   public static readonly loggerServerWsPort = 8889;
}
