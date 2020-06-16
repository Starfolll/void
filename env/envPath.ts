import path from "path";


export default class EnvPath {
   public static readonly rootDir = path.resolve(__dirname, "../");


   private static readonly mailsHtmlTemplatesDir
      = path.resolve(`${EnvPath.rootDir}/src/services/mailer/emails/htmlTemplates`);

   public static readonly mailsHtmlTemplatesFiles = {
      mailVerification: path.resolve(`${EnvPath.mailsHtmlTemplatesDir}/emailTemplate.emailVerification.html`)
   }
}
