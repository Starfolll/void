import uniqid from "uniqid";
import {EmailMailVerificationConfigs} from "../src/services/mailer/emails/emailMailVerification";
import path from "path";


const loggerServerWsPort = 8889;
const rootDir = path.resolve(__dirname, "../");
const mailsHtmlTemplatesDir = path.resolve(`${rootDir}/src/services/mailer/emails/htmlTemplates`);


export default class Env {
   public static readonly deployment: deploymentEnv = "dev";
   public static readonly isProd = Env.deployment === "prod";


   public static readonly upAndRunningMessage = "Up and running";


   public static readonly path = {
      rootDir, mailsHtmlTemplatesDir,
      mailsHtmlTemplatesFiles: {
         mailVerification: path.resolve(`${mailsHtmlTemplatesDir}/emailTemplate.emailVerification.html`)
      }
   } as const;


   public static readonly managers = {
      apiManager: {
         port: 8001,
         path: "/api",
         serverId: `manager/api/${uniqid()}`,
         commonTokenLength: 120
      },
      lobbyManager: {
         wsPort: 8002
      }
   } as const;

   public static readonly services = {
      logger: {
         serverId: `logger/${uniqid()}`,
         wsServerUrl: `ws://localhost:${loggerServerWsPort}`,

         ports: {
            loggerServerPort: 8888,
            loggerServerWsPort
         }
      },

      mailer: {
         host: "smtp.ethereal.email",
         port: 587,
         secure: false,

         devAccount: {
            user: "brett.schaden@ethereal.email",
            pass: "qAMwXFQ3pjQGsQ4JTk"
         } as mailerAccount,

         prodAccount: {
            user: "???",
            pass: "???"
         } as mailerAccount,

         emailsConfigs: {
            mailVerification: {
               htmlPath: Env.path.mailsHtmlTemplatesFiles.mailVerification
            }
         } as { mailVerification: EmailMailVerificationConfigs }
      }
   } as const;
}


type deploymentEnv = "prod" | "dev";
type mailerAccount = {
   user: string;
   pass: string;
}
