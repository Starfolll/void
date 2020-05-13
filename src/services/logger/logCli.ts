import {allLogsType, Log, log, logType} from "./components/log";
import LogServerRequest from "./logServerRequest";
import WebSocket from "ws";


const main = async () => {
   const wsConnection = new WebSocket("ws://localhost:8889/");
   const args = new Set(process.argv.map(e => e.toUpperCase()));

   const logTypes: Set<logType> = new Set<logType>();
   if (!logTypes.has("ALL"))
      allLogsType.forEach(t => {
         if (args.has(t)) logTypes.add(t);
      });

   wsConnection.onmessage = (e: any) => {
      const data: { logType: logType, data: Array<log> } = JSON.parse(e.data);
      data.data.forEach(l => console.log(new Log(l).ToConsoleString()));
   }
   wsConnection.onclose = (e) => console.log(e);
   wsConnection.onopen = (e) => {
      LogServerRequest.AddLog("INFO", "new connection");
      LogServerRequest.WSGetLogsList(wsConnection, [...logTypes]);
      LogServerRequest.WSSubscribeToLogs(wsConnection, [...logTypes]);
   }
};

main().then();
