import nodeMailer from "nodemailer";
import EnvMailer from "../../../env/env.mailer";
import EmailMailVerification from "./emails/emailMailVerification";


export default class Mailer {
   public static readonly host = EnvMailer.host;
   public static readonly port = EnvMailer.port;
   public static readonly secure = EnvMailer.secure;
   public static readonly account =
      EnvMailer.isProd ? EnvMailer.prodAccount : EnvMailer.devAccount;

   public static readonly transporter = nodeMailer.createTransport({
      host: Mailer.host, port: Mailer.port, secure: Mailer.secure,
      auth: Mailer.account,
   });


   public static readonly emails = {
      mailVerification: new EmailMailVerification(EnvMailer.emailsConfigs.mailVerification)
   }
}

