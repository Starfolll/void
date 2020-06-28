import ManagerApi from "./manager.api";
import Env from "../../../env/env";
import Logger from "../../services/logger/logger";


(async () => {
   await Logger.AwaitServer();

   const managerApi = new ManagerApi({
      port: Env.managers.apiManager.port,
      path: Env.managers.apiManager.path,
      params: {},
      routes: {
         user: {
            routes: {
               clusterPath: "/user",
               path: Env.managers.apiManager.path,

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
         },

         lobby: {
            routes: {
               clusterPath: "/lobby",
               path: Env.managers.apiManager.path,

               routesConfigs: {
                  createLobby: {path: "/createNewLobby"}
               }
            },

            configs: {}
         }
      }
   });

   await managerApi.Setup();
   await managerApi.Boot();
})();
