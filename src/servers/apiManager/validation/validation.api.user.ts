import Joi from "joi";
import ValidationApi, {minMaxValidation, regexValidation} from "./validation.api";


export interface ValidationApiUserConfigs {
   readonly email: minMaxValidation;
   readonly password: minMaxValidation;
   readonly token: minMaxValidation;
   readonly userId: minMaxValidation;
   readonly name: minMaxValidation & regexValidation;
   readonly publicName: minMaxValidation & regexValidation;
   readonly anyHash: minMaxValidation;
}


export class ValidationApiUserDefaultConfigs implements ValidationApiUserConfigs {
   public readonly email: minMaxValidation = {
      minLength: 6,
      maxLength: 255
   };

   public readonly password: minMaxValidation = {
      minLength: 8,
      maxLength: 255
   }

   public readonly token: minMaxValidation = {
      minLength: 32,
      maxLength: 255
   };

   public readonly userId: minMaxValidation = {
      minLength: 32,
      maxLength: 255
   };

   public readonly name: minMaxValidation & regexValidation = {
      minLength: 4,
      maxLength: 32,
      regex: /[\w_-]/
   };

   public readonly publicName: minMaxValidation & regexValidation = {
      minLength: 4,
      maxLength: 32,
      regex: /.*/
   };

   public readonly anyHash: minMaxValidation = {
      minLength: 3,
      maxLength: 1000
   }
}


export default class ValidationApiUser extends ValidationApi<ValidationApiUserConfigs> {
   public readonly keys: Record<keyof ValidationApiUserDefaultConfigs, string>
      = Object.keys(ValidationApiUserDefaultConfigs)
      .reduce((p, n) => ({...p, n}), {}) as Record<keyof ValidationApiUserDefaultConfigs, string>;


   constructor(configs?: ValidationApiUserConfigs) {
      super(!!configs ? configs : new ValidationApiUserDefaultConfigs());
   }


   public ValidateEmail(value: string) {
      return Joi.string().email().required()
         .min(this.configs.email.minLength)
         .max(this.configs.email.maxLength)
         .validate(value);
   }

   public ValidatePassword(value: string) {
      return Joi.string().required()
         .min(this.configs.password.minLength)
         .max(this.configs.password.maxLength)
         .validate(value);
   }

   public ValidateToken(value: string) {
      return Joi.string().required()
         .min(this.configs.token.minLength)
         .max(this.configs.token.maxLength)
         .validate(value);
   }

   public ValidateUserId(value: string) {
      return Joi.string().required()
         .min(this.configs.userId.minLength)
         .max(this.configs.userId.maxLength)
         .validate(value);
   }

   public ValidateName(value: string) {
      return Joi.string().required()
         .min(this.configs.name.minLength)
         .max(this.configs.name.maxLength)
         .regex(this.configs.name.regex)
         .validate(value)
   }

   public ValidatePublicName(value: string) {
      return Joi.string().required()
         .min(this.configs.publicName.minLength)
         .max(this.configs.publicName.maxLength)
         .regex(this.configs.publicName.regex)
         .validate(value)
   }

   public ValidateAnyHash(value: string) {
      return Joi.string().required()
         .min(this.configs.anyHash.minLength)
         .max(this.configs.anyHash.maxLength)
         .validate(value)
   }
}
