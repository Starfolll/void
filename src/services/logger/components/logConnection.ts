import WebSocket from "ws";
import {logType} from "./log";
import {logList} from "./logList";


export default class LogConnection {
   private readonly connection: WebSocket;

   public readonly assignedLogTypes: Set<logType> = new Set();


   constructor(connection: WebSocket) {
      this.connection = connection;
   }

   public SendLogsData(logList: logList) {
      this.connection.send(JSON.stringify(logList));
   }
}
