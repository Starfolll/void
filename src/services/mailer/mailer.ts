import nodeMailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import EnvMailer from "../../../env/env.mailer";


export default class Mailer {
   private static readonly host = EnvMailer.host;
   private static readonly port = EnvMailer.port;
   private static readonly secure = EnvMailer.secure;
   private static readonly account =
      EnvMailer.isProd ? EnvMailer.prodAccount : EnvMailer.devAccount;


   private static readonly transporter = nodeMailer.createTransport({
      host: Mailer.host, port: Mailer.port, secure: Mailer.secure,
      auth: Mailer.account,
   });


   public static async SendMail(mailOptions: Mail.Options) {
      await Mailer.transporter.sendMail(mailOptions);
   }
}
