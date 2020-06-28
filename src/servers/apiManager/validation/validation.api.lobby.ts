import ValidationApi, {minMaxValidation} from "./validation.api";
import Joi from "joi";


export interface ValidationApiLobbyConfigs {
   readonly lobbyId: minMaxValidation;
}


export class ValidationApiLobbyDefaultConfigs implements ValidationApiLobbyConfigs {
   public readonly lobbyId: minMaxValidation = {
      minLength: 10,
      maxLength: 255
   };
}


export default class ValidationApiLobby extends ValidationApi<ValidationApiLobbyConfigs> {
   public readonly keys: Record<keyof ValidationApiLobbyDefaultConfigs, string>
      = Object.keys(ValidationApiLobbyDefaultConfigs)
      .reduce((p, n) => ({...p, n}), {}) as Record<keyof ValidationApiLobbyDefaultConfigs, string>;


   constructor(configs?: ValidationApiLobbyConfigs) {
      super(!!configs ? configs : new ValidationApiLobbyDefaultConfigs());
   }


   public ValidateLobbyId(value: string) {
      return Joi.string().required()
         .min(this.configs.lobbyId.minLength)
         .max(this.configs.lobbyId.maxLength)
         .validate(value);
   }
}
