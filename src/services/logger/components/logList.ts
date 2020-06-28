import {Log, LogData, LogType} from "./log";
import LogWrapper from "./logWrapper";


export interface LogListConfigs {
   readonly listInit: {
      logsLimit: number
   };
}


export interface LogListData {
   readonly listType: LogType;
   readonly logs: Array<LogData>;
}


export class LogList {
   public readonly listType: LogType;

   private readonly configs: LogListConfigs;
   private readonly logs: Array<Log> = [];


   constructor(listType: LogType, logs: Array<Log>, configs: LogListConfigs) {
      this.configs = configs;
      this.listType = listType;

      if (!!logs) this.logs = logs
         .splice(logs.length - this.configs.listInit.logsLimit, logs.length)
         .sort((a, b) => (+a.time) - (+b.time));
   }


   public AddLog(log: Log) {
      this.logs.push(log);
   }

   public GetLogs(limit?: number): Array<Log> {
      if (typeof limit === "undefined") return this.logs;
      else return this.logs.splice(this.logs.length - limit, this.logs.length);
   }


   public ToJson(limit?: number): LogListData {
      return {
         listType: this.listType,
         logs: this.GetLogs(limit).map((l: Log) => LogWrapper.ToJson(l))
      };
   }
}
