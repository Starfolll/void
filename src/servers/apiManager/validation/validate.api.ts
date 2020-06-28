import ValidationApiUser, {ValidationApiUserConfigs, ValidationApiUserDefaultConfigs} from "./validation.api.user";
import {ValidationResult} from "joi";
import ValidationApiLobby, {ValidationApiLobbyConfigs, ValidationApiLobbyDefaultConfigs} from "./validation.api.lobby";


interface SetConfigsInput<Name, Configs> {
   name: Name,
   configs: Configs
}

type validateApiSetConfigInput =
   SetConfigsInput<"USER", ValidationApiUserConfigs | ValidationApiUserDefaultConfigs> |
   SetConfigsInput<"LOBBY", ValidationApiLobbyConfigs | ValidationApiLobbyDefaultConfigs>;


export default class ValidateApi {
   public static user: ValidationApiUser = new ValidationApiUser();
   public static lobby: ValidationApiLobby = new ValidationApiLobby();


   public static SetConfigs(input: validateApiSetConfigInput) {
      switch (input.name) {
         case "USER":
            return this.user.SetConfigs(input.configs);

         case "LOBBY":
            return this.lobby.SetConfigs(input.configs);
      }
   }


   public static GetValidationError(validation: ValidationResult<any>): Error | boolean {
      return !!validation.error ? new Error(validation.error.message) : true;
   }
}
