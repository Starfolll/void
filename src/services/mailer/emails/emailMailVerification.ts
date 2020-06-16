import Email from "./email";
import fs from "fs";


export interface EmailMailVerificationConfigs {
   htmlPath: string;
}


export default class EmailMailVerification extends Email {
   constructor(configs: EmailMailVerificationConfigs) {
      super({
         html: fs.readFileSync(configs.htmlPath)
      });
   }
}

