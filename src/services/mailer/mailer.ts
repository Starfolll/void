import nodeMailer from "nodemailer";
import EmailMailVerification from "./emails/emailMailVerification";
import Env from "../../../env/env";


export default class Mailer {
   public static readonly host = Env.services.mailer.host;
   public static readonly port = Env.services.mailer.port;
   public static readonly secure = Env.services.mailer.secure;
   public static readonly account =
      Env.isProd ? Env.services.mailer.prodAccount : Env.services.mailer.devAccount;

   public static readonly transporter = nodeMailer.createTransport({
      host: Mailer.host, port: Mailer.port, secure: Mailer.secure,
      auth: Mailer.account,
   });


   public static readonly emails = {
      mailVerification: new EmailMailVerification(Env.services.mailer.emailsConfigs.mailVerification)
   }
}

