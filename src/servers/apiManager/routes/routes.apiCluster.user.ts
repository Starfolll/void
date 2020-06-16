import RoutesApiCluster, {ApiResponse, ApiRouteConfigs, ApiRoutesConfigs} from "./routes.apiCluster";
import {ApiParams} from "../manager.api.params";
import DbObjectUser, {UserPrivateData} from "../../../../db/objects/DbObject.user";
import DbQueriesUser from "../../../../db/queries/DbQueries.user";
import ValidateApi from "../validation/validate.api";
import uniqId from "uniqid";
import randomString from "crypto-random-string";
import {body, validationResult} from "express-validator";
import bcrypt from "bcrypt";


export type ApiClusterUserRoutes = {
   login: ApiRouteConfigs;
   signUp: ApiRouteConfigs;
   changePasswordRequest: ApiRouteConfigs;
   changePassword: ApiRouteConfigs;
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


export default class RoutesApiClusterUser extends RoutesApiCluster<ApiClusterUserRoutes, keyof ApiClusterUserRoutes, apiResponseUser> {
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
      await this.SendFriendshipRequest();
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

   private GetEmailVerificationUrl(userId: string): string {
      return `${userId}/${randomString({
         length: this.configs.signUp.verificationLinkLength,
         type: "url-safe"
      })}`
   }

   private GetChangePasswordHash(userId: string, hash?: string): string {
      const getHash = (id: string, h: string) => `${id}/${h}`;

      if (!!hash) return getHash(userId, hash);
      else return getHash(userId, `${randomString({
         length: this.configs.changePasswordRequest.hashLength,
         type: "url-safe"
      })}-${uniqId()}`);
   }


   private async Login() {
      const path = this.GetPath("login")
         + this.GetParam(ApiParams.email)
         + this.GetParam(ApiParams.password);

      this.app.post(path, async (req, res) => {
         const email = req.params[ApiParams.email];
         const password = this.GetModifiedPassword(req.params[ApiParams.password]);

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

   }

   private async ChangePasswordRequest() {
      const path = this.GetPath("changePasswordRequest")
         + this.GetParam(ApiParams.email);

      this.app.post(path, async (req, res) => {
         const userEmail = req.body[ApiParams.email];
         const userData = await DbQueriesUser.GetData({email: userEmail});

         const changePasswordHash = this.GetChangePasswordHash(userData!.id);
         await DbQueriesUser.Update({email: userEmail}, {changePasswordHash});

         // TODO : send email

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
         + this.GetParam(ApiParams.anyHash);

      this.app.post(path, [
         body(ValidateApi.user.keys.password).custom(v => ValidateApi.GetValidationError(ValidateApi.user.ValidatePassword(v)))
      ]);

      this.app.post(path, async (req, res) => {
         const userId = req.params[ApiParams.userId];
         const anyHash = req.params[ApiParams.anyHash];
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


   private async SendFriendshipRequest() {

   }

   private async RejectFriendshipRequest() {

   }

   private async AcceptFriendshipRequest() {

   }
}


interface ApiResponseUserLoginData {
   readonly userPrivateData: UserPrivateData;
}

interface ApiResponseUserSignUpData {
   readonly isEmailReserved: boolean;
   readonly isNameReserved: boolean;
   readonly userPrivateData?: UserPrivateData;
}

interface ApiResponseUserPasswordChangePasswordRequestData {
   readonly message: string;
}

interface ApiResponseUserChangePasswordData {
   readonly passwordChanged: boolean;
}

type apiResponseUser =
   ApiResponse<"API_RESPONSE_USER_LOGIN", ApiResponseUserLoginData> |
   ApiResponse<"API_RESPONSE_USER_SIGN_UP", ApiResponseUserSignUpData> |
   ApiResponse<"API_RESPONSE_USER_CHANGE_PASSWORD_REQUEST", ApiResponseUserPasswordChangePasswordRequestData> |
   ApiResponse<"API_RESPONSE_USER_CHANGE_PASSWORD", ApiResponseUserChangePasswordData>
