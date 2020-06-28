import fetch from "node-fetch";
import {LogInput, LogType} from "./components/log";
import {logServerWSConnectionActions} from "./components/logServe";
import WebSocket from "ws";
import isReachable from "is-reachable";
import Env from "../../../env/env";
import util from "util";


export default class Logger {
   public static maxServerIdLength = 20;


   public static async IsServerAlive(): Promise<boolean> {
      return await isReachable(`http://localhost:8888`);
   }

   public static async AwaitServer(): Promise<void> {
      while (!(await Logger.IsServerAlive())) {
         console.log("Waiting for server.logger to start");
         await util.promisify(setTimeout)(5000);
      }
   }

   public static async SendLog(log: LogInput): Promise<void> {
      if (log.type !== LogType.ALL) {
         await fetch(`http://localhost:${Env.services.logger.ports.loggerServerPort}/log/add`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({time: Date.now(), ...log} as LogInput),
         });
      }
   }


   public static async GetServerId(): Promise<string> {
      const res = await fetch(`http://localhost:${Env.services.logger.ports.loggerServerPort}/stats/serverId`);
      return await res.json();
   }


   public static async WSSubscribeToLogs(connection: WebSocket | any, logsType: Array<LogType>) {
      connection.send(JSON.stringify({
         messageType: "SUBSCRIBE_TO_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSUnsubscribeFromLogs(connection: WebSocket | any, logsType: Array<LogType>) {
      connection.send(JSON.stringify({
         messageType: "UNSUBSCRIBE_FROM_LOG", logsType
      } as logServerWSConnectionActions));
   }

   public static async WSGetLogsList(connection: WebSocket | any, logsType: Array<LogType>) {
      connection.send(JSON.stringify({
         messageType: "GET_LOG_LIST", logsType
      } as logServerWSConnectionActions));
   }
}
