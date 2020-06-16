import Env from "./env";
import {EmailMailVerificationConfigs} from "../src/services/mailer/emails/emailMailVerification";
import EnvPath from "./envPath";

type mailerAccount = {
   user: string;
   pass: string;
}


export default class EnvMailer {
   public static readonly host: string = "smtp.ethereal.email";
   public static readonly port: number = 587;
   public static readonly secure: boolean = false;


   public static readonly isProd: boolean = Env.deployment === "prod";


   public static readonly devAccount: mailerAccount = {
      user: "brett.schaden@ethereal.email",
      pass: "qAMwXFQ3pjQGsQ4JTk"
   }

   public static readonly prodAccount: mailerAccount = {
      user: "???",
      pass: "???"
   }


   public static readonly emailsConfigs: {
      mailVerification: EmailMailVerificationConfigs
   } = {
      mailVerification: {
         htmlPath: EnvPath.mailsHtmlTemplatesFiles.mailVerification
      }
   }
}
