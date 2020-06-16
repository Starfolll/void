import Mail from "nodemailer/lib/mailer";
import Mailer from "../mailer";


export default class Email {
   protected readonly mailOptions: Mail.Options;


   constructor(mailOptions: Mail.Options) {
      this.mailOptions = mailOptions;
   }


   public async Send() {
      await Mailer.transporter.sendMail(this.mailOptions);
   }
}
