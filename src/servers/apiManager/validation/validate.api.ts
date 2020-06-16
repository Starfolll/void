import ValidationApiUser, {ValidationApiUserConfigs, ValidationApiUserDefaultConfigs} from "./validation.api.user";
import {ValidationResult} from "joi";


type validateApiSetConfigInput = {
   sectionName: "USER",
   configs: ValidationApiUserConfigs | ValidationApiUserDefaultConfigs,
};


export default class ValidateApi {
   public static user: ValidationApiUser = new ValidationApiUser();


   public static SetConfigs(input: validateApiSetConfigInput) {
      switch (input.sectionName) {
         case "USER":
            this.user.SetConfigs(input.configs);
      }
   }


   public static GetValidationError(validation: ValidationResult<any>): Error | boolean {
      return !!validation.error ? new Error(validation.error.message) : true;
   }
}
