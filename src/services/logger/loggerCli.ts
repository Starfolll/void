import {allLogsType, Log, logType} from "./components/log";
import LoggerServerApi from "./loggerServerApi";
import WebSocket from "ws";
import LogWrapper from "./components/logWrapper";
import {logList} from "./components/logList";


(async () => {
   if (!await LoggerServerApi.IsServerAlive()) return;

   const wsConnection = new WebSocket("ws://localhost:8889/");
   const args = new Set(process.argv.map(e => e.toUpperCase()));

   const logTypes: Set<logType> = new Set<logType>();
   if (!logTypes.has("ALL"))
      allLogsType.forEach(t => {
         if (args.has(t)) logTypes.add(t);
      });

   if (logTypes.size === 0) logTypes.add("ALL");

   wsConnection.onmessage = (e: any) => {
      const data: logList = JSON.parse(e.data);
      data.logs.forEach(l => console.log(LogWrapper.ToConsoleString(new Log(l))));
   }
   wsConnection.onclose = (e) => console.log(e);
   wsConnection.onopen = (e) => {
      LoggerServerApi.WSGetLogsList(wsConnection, [...logTypes]);
      LoggerServerApi.WSSubscribeToLogs(wsConnection, [...logTypes]);
   }
})();
