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
                  login: {path: "/login"},
                  signUp: {path: "/signUp"},
                  verifyEmail: {path: "/verifyEmail"},
                  acceptFriendshipRequest: {path: "/acceptFriendshipRequest"},
                  rejectFriendshipRequest: {path: "/rejectFriendshipRequest"},
                  sendFriendshipRequest: {path: "/sendFriendshipRequest"},
                  changePassword: {path: "/changePassword"},
                  changePasswordRequest: {path: "/changePasswordRequest"}
               }
            },
            configs: {
               login: {
                  unmatchedValuesMessage: "Invalid password or email"
               },
               changePasswordRequest: {
                  hashLength: 120,
                  message: "Change password request sent"
               },
               signUp: {
                  tokenLength: 120,
                  verificationLinkLength: 120,
                  automaticVerifyUserEmails: false,
                  passwordEncryption: {
                     salt: 10,
                     secret: "api-secret"
                  },
                  userStarterPack: {
                     gold: 10,
                     xp: 10,
                     lvl: 10
                  }
               }
            }
         }
      }
   });

   await managerApi.Setup();
   await managerApi.Boot();
})();
