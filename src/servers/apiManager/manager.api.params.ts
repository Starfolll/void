import express, {Express} from "express";
import LoggerServerApi from "../../services/logger/loggerServerApi";
import DbQueriesUser from "../../../db/queries/DbQueries.user";
import ValidateApi from "./validation/validate.api";
import {UserWhereUniqueInput} from "../../../generated/prisma-client";
import {LogType} from "../../services/logger/components/log";
import Manager from "../../utils/manager/manager";
import Env from "../../../env/env";


export enum ApiParams {
   email = "email",
   password = "password",
   token = "token",
   userId = "userId",
   anyHash = "anyHash"
}


export interface ManagerApiParamsConfigs {

}


export default class ManagerApiParams extends Manager<ManagerApiParamsConfigs> {
   private readonly app: Express;


   constructor(configs: ManagerApiParamsConfigs) {
      super(configs);

      this.app = express();
      this.app.on("mount", async () => {
         await LoggerServerApi.SendLog({
            type: LogType.INFO,
            serverId: Env.managers.apiManager.serverId,
            data: `${Env.upAndRunningMessage} [manager api params]`
         });
      });
   }


   public async Boot() {
      await this.Email();
      await this.UserId();
      await this.Password();
      await this.Token();
      await this.AnyHash();
   }

   public async Setup(app: Express): Promise<void> {
      app.use(this.app);
   }


   private GetValidationError(errorName: string) {
      return new Error(`${errorName} validation error`.toLowerCase());
   }

   private GetUserDoesNotExistsError() {
      return new Error(`user does not exists`);
   }


   private async IsUserExistsAndVerified(uniqueInput: UserWhereUniqueInput) {
      return await DbQueriesUser.IsExists(uniqueInput)
         && (await DbQueriesUser.GetData(uniqueInput))!.isVerified;
   }


   private async Email() {
      this.app.param(ApiParams.email, async (req, res, next, value, name) => {
         if (!!ValidateApi.user.ValidateEmail(value).error)
            return next(this.GetValidationError(name));

         if (await this.IsUserExistsAndVerified({email: value})) next();
         else next(this.GetUserDoesNotExistsError());
      });
   }

   private async Password() {
      this.app.param(ApiParams.password, async (req, res, next, value, name) => {
         if (!!ValidateApi.user.ValidatePassword(value).error)
            return next(this.GetValidationError(name));

         next();
      });
   }

   private async Token() {
      this.app.param(ApiParams.token, async (req, res, next, value, name) => {
         if (!!ValidateApi.user.ValidateToken(value).error)
            return next(this.GetValidationError(name));

         if (await this.IsUserExistsAndVerified({token: value})) next();
         else next(this.GetUserDoesNotExistsError());
      });
   }

   private async UserId() {
      this.app.param(ApiParams.userId, async (req, res, next, value, name) => {
         if (!!ValidateApi.user.ValidateUserId(value).error)
            return next(this.GetValidationError(name));

         if (await this.IsUserExistsAndVerified({id: value})) next();
         else next(this.GetUserDoesNotExistsError());
      });
   }

   private async AnyHash() {
      this.app.param(ApiParams.anyHash, async (req, res, next, value, name) => {
         if (!!ValidateApi.user.ValidateAnyHash(value).error)
            return next(this.GetValidationError(name));

         next();
      });
   }
}
