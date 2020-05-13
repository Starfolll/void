import WebSocket from "ws";
import {log, logType} from "./log";
import {LogList} from "./logList";


export default class LogConnection {
   private readonly connection: WebSocket;

   public readonly assignedLogTypes: Set<logType> = new Set();


   constructor(connection: WebSocket) {
      this.connection = connection;
   }

   public SendLogsData(logType: logType, data: Array<log>) {
      this.connection.send(JSON.stringify({logType, data}));
   }
}
