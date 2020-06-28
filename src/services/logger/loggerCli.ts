import {Log, LogType} from "./components/log";
import Logger from "./logger";
import WebSocket from "ws";
import LogWrapper from "./components/logWrapper";
import {LogListData} from "./components/logList";
import Env from "../../../env/env";
import chalk from "chalk";


(async () => {
   if (!await Logger.IsServerAlive()) return console.error("LOG SERVER IS NOT ALIVE");
   else {
      console.log(chalk.greenBright(` [ LOG SERVER IS ALIVE ] `));
      console.log(` | Logger server id : ${await Logger.GetServerId()}`);
      console.log(` | To see more go to http://localhost:${Env.services.logger.ports.loggerServerPort}`);
   }

   const wsConnection = new WebSocket(Env.services.logger.wsServerUrl);
   const upperCaseArgs = process.argv.map(e => e.toUpperCase());

   const logTypeArgs: Array<LogType> = upperCaseArgs.filter(upperCaseArg => Object.keys(LogType).some(lt => upperCaseArg === lt)) as Array<LogType>;
   const selectedLogsChanel: Array<LogType> = [];

   if (logTypeArgs.some(e => e === LogType.ALL)) selectedLogsChanel.push(LogType.ALL);
   else logTypeArgs.forEach(e => selectedLogsChanel.push(e));
   if (selectedLogsChanel.length === 0) selectedLogsChanel.push(LogType.ALL);


   console.log();
   selectedLogsChanel.forEach(e => console.log(` | Selected logs canal : ${e}`));
   console.log();

   wsConnection.onmessage = (e: any) => {
      const data: LogListData = JSON.parse(e.data);
      data.logs.forEach(l => {
         if (Logger.maxServerIdLength < l.serverId.length)
            Logger.maxServerIdLength = l.serverId.length;

         console.log(LogWrapper.ToConsoleString(new Log(l)));
      });
   }

   wsConnection.onclose = (e) => console.log(e);
   wsConnection.onopen = (e) => {
      Logger.WSGetLogsList(wsConnection, selectedLogsChanel);
      Logger.WSSubscribeToLogs(wsConnection, selectedLogsChanel);
   }
})();
