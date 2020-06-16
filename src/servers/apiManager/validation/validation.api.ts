export type minMaxValidation = {
   readonly minLength: number;
   readonly maxLength: number;
}

export type regexValidation = {
   readonly regex: RegExp;
}


export default class ValidationApi<Configs> {
   protected configs: Configs;


   constructor(configs: Configs) {
      this.configs = configs;
   }


   public SetConfigs(configs: Configs) {
      this.configs = configs;
   }
}
