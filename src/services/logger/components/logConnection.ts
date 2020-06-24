import WebSocket from "ws";
import {LogType} from "./log";
import {LogListData} from "./logList";


export default class LogConnection {
   private readonly connection: WebSocket;

   public readonly assignedLogTypes: Set<LogType> = new Set();


   constructor(connection: WebSocket) {
      this.connection = connection;
   }

   public SendLogsData(logList: LogListData) {
      this.connection.send(JSON.stringify(logList));
   }
}
