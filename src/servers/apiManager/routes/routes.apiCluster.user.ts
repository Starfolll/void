import RoutesApiCluster, {ApiResponse, ApiRouteConfigs, ApiRoutesConfigs} from "./routes.apiCluster";
import {ApiParams} from "../manager.api.params";
import DbObjectUser, {UserPrivateData} from "../../../../db/objects/DbObject.user";
import DbQueriesUser from "../../../../db/queries/DbQueries.user";
import ValidateApi from "../validation/validate.api";
import uniqId from "uniqid";
import randomString from "crypto-random-string";
import {body, validationResult} from "express-validator";
import bcrypt from "bcrypt";
import Mailer from "../../../services/mailer/mailer";


export namespace ApiClusterUser {
   export type ApiClusterUserRoutes = {
      login: ApiRouteConfigs;
      signUp: ApiRouteConfigs;
      verifyEmail: ApiRouteConfigs;

      changePasswordRequest: ApiRouteConfigs;
      changePassword: ApiRouteConfigs;

      sendFriendshipRequest: ApiRouteConfigs;
      rejectFriendshipRequest: ApiRouteConfigs;
      acceptFriendshipRequest: ApiRouteConfigs;
   }

   export type ApiClusterUserConfigs = {
      login: {
         unmatchedValuesMessage: string;
      },
      signUp: {
         userStarterPack: {
            xp: number;
            lvl: number;
            gold: number;
         },
         passwordEncryption: {
            salt: number;
            secret: string;
         }
         tokenLength: number;
         verificationLinkLength: number;
         automaticVerifyUserEmails: boolean;
      },
      changePasswordRequest: {
         message: string;
         hashLength: number;
      }
   }


   export class RoutesApiClusterUser extends RoutesApiCluster<ApiClusterUserRoutes, keyof ApiClusterUserRoutes, apiResponseUser> {
      private readonly configs: ApiClusterUserConfigs;


      constructor(routes: ApiRoutesConfigs<ApiClusterUserRoutes>, configs: ApiClusterUserConfigs) {
         super(routes);
         this.configs = configs;
      }


      public async BindApi() {
         await this.Login();
         await this.SignUp();
         await this.VerifyEmail();

         await this.ChangePasswordRequest();
         await this.ChangePassword();

         await this.RejectFriendshipRequest();
         await this.AcceptFriendshipRequest();
         await this.FriendshipRequest();

         
         await this.LogApiRoutes();
      }


      private GetModifiedPassword(password: string): string {
         return `${this.configs.signUp.passwordEncryption.secret}-${this.configs.signUp.passwordEncryption.salt}-${password}`;
      }

      private GetEncryptedPassword(password: string): string {
         return bcrypt.hashSync(
            `${this.configs.signUp.passwordEncryption.secret}/${password}`,
            this.configs.signUp.passwordEncryption.salt
         );
      }

      private GetToken(userId: string): string {
         return `${userId}/token-${randomString({
            length: this.configs.signUp.tokenLength,
            type: "url-safe",
         })}`;
      }

      private GetEmailVerificationUrl(userId: string, hash?: string): string {
         const getHash = (h: string) => `${userId}/${h}`;

         if (!!hash) return getHash(hash);
         else return getHash(randomString({
            length: this.configs.signUp.verificationLinkLength,
            type: "url-safe"
         }));
      }

      private GetChangePasswordHash(userId: string, hash?: string): string {
         const getHash = (h: string) => `${userId}/${h}`;

         if (!!hash) return getHash(hash);
         else return getHash(`${randomString({
            length: this.configs.changePasswordRequest.hashLength,
            type: "url-safe"
         })}-${uniqId()}`);
      }


      private async Login() {
         const path = this.GetPath("login")
            + this.GetParam(ApiParams.email)

         this.app.post(path, [
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidatePassword(v))),
         ]);

         this.app.post(path, async (req, res) => {
            const email = req.params[ApiParams.email];
            const password = this.GetModifiedPassword(req.body[ValidateApi.user.keys.password]);

            const userData = await DbQueriesUser.GetData({email});

            if (DbObjectUser.IsPasswordValid(password, userData!.password))
               return await this.Response(res, {
                  responseName: "API_RESPONSE_USER_LOGIN",
                  response: {
                     data: {
                        userPrivateData: DbObjectUser.GetPrivateData(userData!)
                     } as ApiResponseUserLoginData
                  }
               });

            await this.Response(res, this.GetErrorResponse(
               "API_RESPONSE_USER_LOGIN",
               this.configs.login.unmatchedValuesMessage,
            ));
         });
      }

      private async SignUp() {
         const path = this.GetPath("signUp");

         this.app.post(path, [
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidateEmail(v))),
            body(ValidateApi.user.keys.password).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidatePassword(v))),
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidateName(v))),
            body(ValidateApi.user.keys.publicName).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidatePublicName(v)))
         ]);

         this.app.post(path, async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return this.Response(res, this.GetErrorResponse(
               "API_RESPONSE_USER_SIGN_UP", errors.array(),
               {res, status: this.statusCodes.validationError}
            ));

            const userId = uniqId();
            const userName = req.body[ValidateApi.user.keys.name];
            const userEmail = req.body[ValidateApi.user.keys.email];
            const userPassword = this.GetModifiedPassword(req.body[ValidateApi.user.keys.password]);
            const userPublicName = req.body[ValidateApi.user.keys.publicName];

            const userWithEmail = await DbQueriesUser.IsExists({email: userEmail});
            const userWithName = await DbQueriesUser.IsExists({name: userName});

            if (!userWithName && !userWithEmail) await DbQueriesUser.Create({
               id: userId,
               email: userEmail,
               name: userName,
               password: this.GetEncryptedPassword(userPassword),
               publicName: userPublicName,

               token: this.GetToken(userId),

               isVerified: this.configs.signUp.automaticVerifyUserEmails,
               verificationLink: this.configs.signUp.automaticVerifyUserEmails ?
                  this.GetEmailVerificationUrl(userId) : undefined,

               xp: this.configs.signUp.userStarterPack.xp,
               lvl: this.configs.signUp.userStarterPack.lvl,
               gold: this.configs.signUp.userStarterPack.gold
            });


            await this.Response(res, {
               responseName: "API_RESPONSE_USER_SIGN_UP",
               response: {
                  data: {
                     isEmailReserved: userWithEmail,
                     isNameReserved: userWithName,
                     isAutomaticVerificationOn: this.configs.signUp.automaticVerifyUserEmails,
                     userPrivateData: this.configs.signUp.automaticVerifyUserEmails ?
                        DbObjectUser.GetPrivateData((await DbQueriesUser.GetData({id: userId}))!) : undefined,
                  } as ApiResponseUserSignUpData
               }
            });
         });
      }

      private async VerifyEmail() {
         const path = this.GetPath("verifyEmail")
            + this.GetParam(ApiParams.userId)

         this.app.post(path, [
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidateAnyHash(v))),
         ]);

         this.app.post(path, async (req, res) => {
            const userId = req.params[ApiParams.userId];
            const anyHash = req.body[ValidateApi.user.keys.anyHash];

            const userData = await DbQueriesUser.GetData({id: userId});

            if (userData!.verificationLink === this.GetEmailVerificationUrl(userId, anyHash))
               return await this.Response(res, this.GetErrorResponse(
                  API_RESPONSE_USER_VERIFY_EMAIL,
                  "Something went wrong"
               ));

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_VERIFY_EMAIL",
               response: {} as ApiResponseUserVerifyEmailData
            })
         });
      }

      private async ChangePasswordRequest() {
         const path = this.GetPath("changePasswordRequest")
            + this.GetParam(ApiParams.email);

         this.app.post(path, async (req, res) => {
            const userEmail = req.body[ApiParams.email];
            const userData = await DbQueriesUser.GetData({email: userEmail});

            const changePasswordHash = this.GetChangePasswordHash(userData!.id);
            await DbQueriesUser.Update({email: userEmail}, {changePasswordHash});

            Mailer.emails.mailVerification.Send().then();

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_CHANGE_PASSWORD_REQUEST",
               response: {
                  data: {
                     message: this.configs.changePasswordRequest.message
                  } as ApiResponseUserPasswordChangePasswordRequestData
               }
            });
         });
      }

      private async ChangePassword() {
         const path = this.GetPath("changePassword")
            + this.GetParam(ApiParams.userId)

         this.app.post(path, [
            body(ValidateApi.user.keys.name).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidateAnyHash(v))),
         ]);

         this.app.post(path, async (req, res) => {
            const userId = req.params[ApiParams.userId];
            const anyHash = req.body[ValidateApi.user.keys.anyHash];
            const userPassword = this.GetModifiedPassword(req.body[ValidateApi.user.keys.password]);

            const userData = await DbQueriesUser.GetData({id: userId});
            const isHashValid = this.GetChangePasswordHash(userId, anyHash) === userData!.changePasswordHash;

            if (isHashValid) await DbQueriesUser.Update({id: userId}, {
               changePasswordHash: undefined,
               password: this.GetEncryptedPassword(userPassword)
            });

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_CHANGE_PASSWORD",
               response: {
                  data: {
                     passwordChanged: isHashValid
                  } as ApiResponseUserChangePasswordData
               }
            });
         });
      }


      private async FriendshipRequest() {
         const path = this.GetPath("sendFriendshipRequest")
            + this.GetParam(ApiParams.token)
            + this.GetParam(ApiParams.userId);

         this.app.post(path, async (req, res) => {
            const userToken = req.params[ApiParams.token];
            const friendId = req.params[ApiParams.userId];

            await DbQueriesUser.Update({id: friendId}, {friendInvites: {connect: {token: userToken}}});

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_FRIENDSHIP_REQUEST",
               response: {
                  data: {} as ApiResponseFriendshipRequestData
               }
            });
         });
      }

      private async RejectFriendshipRequest() {
         const path = this.GetPath("rejectFriendshipRequest")
            + this.GetParam(ApiParams.token)
            + this.GetParam(ApiParams.userId);

         this.app.post(path, async (req, res) => {
            const userToken = req.params[ApiParams.token];
            const friendId = req.params[ApiParams.userId];

            await DbQueriesUser.Update({id: friendId}, {friendInvites: {disconnect: {token: userToken}}});

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_REJECT_FRIENDSHIP_REQUEST",
               response: {
                  data: {} as ApiResponseRejectFriendshipRequestData
               }
            });
         });
      }

      private async AcceptFriendshipRequest() {
         const path = this.GetPath("acceptFriendshipRequest")
            + this.GetParam(ApiParams.token)
            + this.GetParam(ApiParams.userId);

         this.app.post(path, async (req, res) => {
            const userToken = req.params[ApiParams.token];
            const friendId = req.params[ApiParams.userId];

            await DbQueriesUser.Update({id: friendId}, {friendInvites: {disconnect: {token: userToken}}});

            await DbQueriesUser.Update({id: friendId}, {friends: {connect: {token: userToken}}});
            await DbQueriesUser.Update({token: userToken}, {friends: {connect: {id: friendId}}});

            await this.Response(res, {
               responseName: "API_RESPONSE_USER_ACCEPT_FRIENDSHIP_REQUEST",
               response: {
                  data: {} as ApiResponseAcceptFriendshipRequestData
               }
            });
         });
      }
   }


   export interface ApiResponseUserLoginData {
      readonly userPrivateData: UserPrivateData;
   }

   export interface ApiResponseUserSignUpData {
      readonly isEmailReserved: boolean;
      readonly isNameReserved: boolean;
      readonly userPrivateData?: UserPrivateData;
   }

   export interface ApiResponseUserVerifyEmailData {

   }

   export interface ApiResponseUserPasswordChangePasswordRequestData {
      readonly message: string;
   }

   export interface ApiResponseUserChangePasswordData {
      readonly passwordChanged: boolean;
   }

   export interface ApiResponseFriendshipRequestData {

   }

   export interface ApiResponseRejectFriendshipRequestData {

   }

   export interface ApiResponseAcceptFriendshipRequestData {

   }

   const API_RESPONSE_USER_LOGIN = "API_RESPONSE_USER_LOGIN";
   const API_RESPONSE_USER_SIGN_UP = "API_RESPONSE_USER_SIGN_UP";
   const API_RESPONSE_USER_VERIFY_EMAIL = "API_RESPONSE_USER_VERIFY_EMAIL";
   const API_RESPONSE_USER_CHANGE_PASSWORD_REQUEST = "API_RESPONSE_USER_CHANGE_PASSWORD_REQUEST";
   const API_RESPONSE_USER_CHANGE_PASSWORD = "API_RESPONSE_USER_CHANGE_PASSWORD";
   const API_RESPONSE_USER_FRIENDSHIP_REQUEST = "API_RESPONSE_USER_FRIENDSHIP_REQUEST";
   const API_RESPONSE_USER_REJECT_FRIENDSHIP_REQUEST = "API_RESPONSE_USER_REJECT_FRIENDSHIP_REQUEST";
   const API_RESPONSE_USER_ACCEPT_FRIENDSHIP_REQUEST = "API_RESPONSE_USER_ACCEPT_FRIENDSHIP_REQUEST";

   export type apiResponseUser =
      ApiResponse<typeof API_RESPONSE_USER_LOGIN, ApiResponseUserLoginData>
      |
      ApiResponse<typeof API_RESPONSE_USER_SIGN_UP, ApiResponseUserSignUpData>
      |
      ApiResponse<typeof API_RESPONSE_USER_VERIFY_EMAIL, ApiResponseUserVerifyEmailData>
      |
      ApiResponse<typeof API_RESPONSE_USER_CHANGE_PASSWORD_REQUEST, ApiResponseUserPasswordChangePasswordRequestData>
      |
      ApiResponse<typeof API_RESPONSE_USER_CHANGE_PASSWORD, ApiResponseUserChangePasswordData>
      |
      ApiResponse<typeof API_RESPONSE_USER_FRIENDSHIP_REQUEST, ApiResponseFriendshipRequestData>
      |
      ApiResponse<typeof API_RESPONSE_USER_REJECT_FRIENDSHIP_REQUEST, ApiResponseRejectFriendshipRequestData>
      |
      ApiResponse<typeof API_RESPONSE_USER_ACCEPT_FRIENDSHIP_REQUEST, ApiResponseAcceptFriendshipRequestData>;
}
