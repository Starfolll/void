import fetch from "node-fetch";
import {logType} from "./components/log";
import {logServerWSConnectionActions} from "./components/logServe";
import WebSocket from "ws";
import isReachable from "is-reachable";


export default class LoggerServerApi {
   public static async IsServerAlive(): Promise<boolean> {
      return await isReachable(`http://localhost:8888`);
   }

   public static async AddLog(logType: logType, data: string): Promise<void> {
      if (logType !== "ALL") {
         await fetch(`http://localhost:8888/log/add/${logType.toLowerCase()}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data})
         });
      }
   }

   public static async WSSubscribeToLogs(connection: WebSocket | any, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "SUBSCRIBE_TO_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSUnsubscribeFromLogs(connection: WebSocket | any, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "UNSUBSCRIBE_FROM_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSGetLogsList(connection: WebSocket | any, logsType: Array<logType>) {
      connection.send(JSON.stringify({
         messageType: "GET_LOG_LIST", logsType
      } as logServerWSConnectionActions));
   }
}
