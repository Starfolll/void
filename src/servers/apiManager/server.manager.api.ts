import ManagerApi from "./manager.api";
import Env from "../../../env/env";


(async () => {
   const managerApi = new ManagerApi({
      port: Env.managers.apiManager.apiPort,
      apiPath: Env.managers.apiManager.apiPath,
      params: {},
      routes: {
         user: {
            routes: {
               clusterPath: "/user",
               apiPath: Env.managers.apiManager.apiPath,
               routesConfigs: {
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
                  hashLength: Env.managers.apiManager.commonTokenLength,
                  message: "Change password request sent"
               },
               signUp: {
                  tokenLength: Env.managers.apiManager.commonTokenLength,
                  verificationLinkLength: Env.managers.apiManager.commonTokenLength,
                  automaticVerifyUserEmails: false,
                  passwordEncryption: {
                     salt: 10,
                     secret: "api-secret"
                  },
                  userStarterPack: {
                     gold: 0,
                     xp: 0,
                     lvl: 1
                  }
               }
            }
         }
      }
   });

   await managerApi.Setup();
   await managerApi.Boot();
})();
