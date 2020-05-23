import {log, Log, logType} from "./log";
import LogWrapper from "./logWrapper";


export type logList = {
   listType: logType;
   logs: Array<log>;
}

export class LogList {
   public readonly listType: logType;
   private readonly logs: Array<Log> = [];


   constructor(props: {
      listType: logType,
      logs?: Array<Log>,
   }, initialLogsLimit: number = 1000) {
      this.listType = props.listType;
      if (!!props.logs) this.logs = props.logs
         .splice(props.logs.length - initialLogsLimit, props.logs.length)
         .sort((a, b) => (+a.time) - (+b.time));
   }


   public AddLog(log: Log) {
      this.logs.push(log);
   }

   public GetLogs(limit?: number): Array<Log> {
      if (typeof limit === "undefined") return this.logs;
      else return this.logs.splice(this.logs.length - limit, this.logs.length);
   }


   public ToJson(limit?: number): logList {
      return {
         listType: this.listType,
         logs: this.GetLogs(limit).map((l: Log) => LogWrapper.ToJson(l))
      };
   }
}
