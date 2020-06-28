import {Log, LogData} from "./log";
import chalk from "chalk";
import Logger from "../logger";

export default class LogWrapper {
   private static WrapLogStringToLogColor(log: Log): string {
      switch (log.type) {
         case "ALL":
            return chalk.white(log.type);

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

         default:
            return chalk.white(log.type);
      }
   }

   public static ToConsoleString(log: Log): string {
      return `[${log.time.toUTCString()}] [${log.serverId.padEnd(Logger.maxServerIdLength)}] [${LogWrapper.WrapLogStringToLogColor(log).padEnd(5)}] ${log.data}`;
   }

   public static ToJson(log: Log): LogData {
      return {
         data: log.data,
         time: log.time,
         type: log.type,
         id: log.id,
         serverId: log.serverId
      };
   }
}
