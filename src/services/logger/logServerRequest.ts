import fetch from "node-fetch";
import {logType} from "./components/log";
import {logServerWSConnectionActions} from "./components/logServe";
import WebSocket from "ws";

export default class LogServerRequest {
   public static async AddLog(logType: logType, data: string): Promise<void> {
      if (logType !== "ALL") {
         await fetch(`http://localhost:8888/log/add/${logType.toLowerCase()}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data})
         });
      }
   }

   public static async WSSubscribeToLogs(connection: WebSocket, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "SUBSCRIBE_TO_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSUnsubscribeFromLogs(connection: WebSocket, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "UNSUBSCRIBE_FROM_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSGetLogsList(connection: WebSocket, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "GET_LOG_LIST", logsType
      } as logServerWSConnectionActions));
   }
}
