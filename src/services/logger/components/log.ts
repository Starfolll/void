import uniqId from "uniqid";


export enum LogType {
   DEBUG = "DEBUG",
   INFO = "INFO",
   WARN = "WARN",
   ERROR = "ERROR",
   FATAL = "FATAL",
   TRACE = "TRACE",
   ALL = "ALL"
}


export interface LogData {
   readonly type: LogType;
   readonly time: Date;
   readonly data: string;
   readonly id: string;
   readonly serverId: string;
}

export interface LogInput {
   readonly id?: string;
   readonly type: LogType;
   readonly time?: Date;
   readonly data: string;
   readonly serverId: string;
}


export class Log implements LogData {
   public readonly type: LogType;
   public readonly time: Date;
   public readonly data: string;
   public readonly id: string;
   public readonly serverId: string;


   constructor(logInput: LogInput) {
      this.type = logInput.type;
      this.data = logInput.data;
      this.serverId = logInput.serverId;

      this.id = !!logInput.id ? logInput.id : uniqId();

      this.time = !!logInput.time ? new Date(logInput.time) : new Date(Date.now());
   }
}
