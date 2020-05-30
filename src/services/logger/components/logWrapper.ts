import {log, Log} from "./log";
import chalk from "chalk";

export default class LogWrapper {
   private static WrapLogStringToLogColor(log: Log): string {
      switch (log.type) {
         case "ALL":
            return log.type;

         case "INFO":
            return chalk.blueBright(log.type);

         case "DEBUG":
         case "TRACE":
            return chalk.greenBright(log.type);

         case "WARN":
            return chalk.yellowBright(log.type);

         case "ERROR":
         case "FATAL":
            return chalk.redBright(log.type);
      }
   }

   public static ToConsoleString(log: Log): string {
      return `[${log.time.toUTCString()}] [${LogWrapper.WrapLogStringToLogColor(log).padEnd(5)}] ${log.data}`;
   }

   public static ToJson(log: Log): log {
      return {
         data: log.data,
         time: log.time,
         type: log.type,
         id: log.id
      };
   }

   public static ToHTML(log: Log): string {
      return `<p>[${log.time.toUTCString()}] [${log.type}] ${log.data}</p>`;
   }
}
