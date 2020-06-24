import {LogList, LogListConfigs} from "./logList";
import {Log, LogInput, LogType} from "./log";
import WebSocket from "ws";
import LogConnection from "./logConnection";
import uniqId from "uniqid";
import Joi from "joi";
import LogWrapper from "./logWrapper";
import Env from "../../../../env/env";


const SUBSCRIBE_TO_LOG = "SUBSCRIBE_TO_LOG";
const UNSUBSCRIBE_FROM_LOG = "UNSUBSCRIBE_FROM_LOG";
const GET_LOG_LIST = "GET_LOG_LIST";

interface ConnectionSubscribeToLogs {
   messageType: typeof SUBSCRIBE_TO_LOG;
   logsType: Array<LogType>;
}

interface ConnectionUnsubscribeFromLogs {
   messageType: typeof UNSUBSCRIBE_FROM_LOG;
   logsType: Array<LogType>;
}

interface ConnectionGetLogList {
   messageType: typeof GET_LOG_LIST;
   logsType: Array<LogType>;
}

export type logServerWSConnectionActions =
   ConnectionSubscribeToLogs |
   ConnectionUnsubscribeFromLogs |
   ConnectionGetLogList;


export default class LogServe {
   private readonly wsPort: number;
   private readonly logConnections: { [uniqId: string]: LogConnection } = {};

   private readonly logsListsConfigs: Record<LogType, LogListConfigs>;
   public readonly logsList: Record<LogType, LogList>;


   constructor(wsPort: number, logsListsConfigs: Record<LogType, LogListConfigs>) {
      this.wsPort = wsPort;
      this.logsListsConfigs = logsListsConfigs;

      this.logsList = {
         ALL: new LogList(LogType.ALL, [], this.logsListsConfigs.ALL),
         INFO: new LogList(LogType.INFO, [], this.logsListsConfigs.INFO),
         DEBUG: new LogList(LogType.DEBUG, [], this.logsListsConfigs.DEBUG),
         ERROR: new LogList(LogType.ERROR, [], this.logsListsConfigs.ERROR),
         FATAL: new LogList(LogType.FATAL, [], this.logsListsConfigs.FATAL),
         TRACE: new LogList(LogType.TRACE, [], this.logsListsConfigs.TRACE),
         WARN: new LogList(LogType.WARN, [], this.logsListsConfigs.WARN),
      }

      const wsServer = new WebSocket.Server({port: this.wsPort});
      wsServer.on("connection", (connection: WebSocket, req) => {
         const connectionUniqId = uniqId(`${Math.random() * 1000000000 | 0}`);
         this.logConnections[connectionUniqId] = new LogConnection(connection);
         this.AddLog({
            type: LogType.TRACE,
            serverId: Env.logger.serverId,
            data: `new log connection: ${req.connection.remoteAddress}`,
         });

         connection.on("message", async (event: string) => {
            const data: logServerWSConnectionActions = JSON.parse(event);
            const dataSchema = Joi.object({
               messageType: Joi.string().required(),
               logsType: Joi.array().required()
            });

            if (!!dataSchema.validate(data).error) return;

            const allLogsType = new Set<LogType>(Object.keys(LogType) as Array<LogType>);

            switch (data.messageType) {
               case "GET_LOG_LIST":
                  const logsBundle = this.GetLogsBundle(data.logsType);
                  this.logConnections[connectionUniqId].SendLogsData(logsBundle.ToJson());
                  break;

               case "SUBSCRIBE_TO_LOG":
                  if (data.logsType.some(t => t.toUpperCase() === "ALL")) {
                     allLogsType.forEach(t => this.logConnections[connectionUniqId].assignedLogTypes.add(t));
                  } else {
                     data.logsType.forEach(t => {
                        if (allLogsType.has(t)) this.logConnections[connectionUniqId].assignedLogTypes.add(t);
                     });
                  }
                  break;

               case "UNSUBSCRIBE_FROM_LOG":
                  if (data.logsType.some(t => t.toUpperCase() === "ALL")) {
                     allLogsType.forEach(t => this.logConnections[connectionUniqId].assignedLogTypes.delete(t));
                  } else {
                     data.logsType.forEach(t => {
                        if (allLogsType.has(t)) this.logConnections[connectionUniqId].assignedLogTypes.delete(t);
                     });
                  }
                  break;
            }
         });

         connection.on("close", () => delete this.logConnections[connectionUniqId]);
      });
   }


   public GetLogsBundle(logsType?: Array<LogType>): LogList {
      const types = !!logsType ? new Set<LogType>(logsType) : null;
      const allLogsType = new Set<LogType>(Object.keys(LogType) as Array<LogType>);
      let logs: Array<Log> = [];

      if (types?.has(LogType.ALL)) allLogsType.forEach((t: LogType) => {
         if (t !== "ALL") logs.push(...this.logsList[t].GetLogs())
      });
      else allLogsType.forEach((t: LogType) => {
         if (t !== "ALL" && types?.has(t)) logs.push(...this.logsList[t].GetLogs())
      });

      return new LogList(LogType.ALL, logs, this.logsListsConfigs.ALL);
   }

   public AddLog(logInput: LogInput) {
      if (logInput.type !== LogType.ALL) {
         const newLog = new Log(logInput);
         console.log(LogWrapper.ToConsoleString(newLog));

         this.logsList[logInput.type].AddLog(newLog);
         this.SendLogToConnections(newLog);
      }
   }

   private SendLogToConnections(log: Log) {
      for (let connection in this.logConnections) {
         const logConnection = this.logConnections[connection];

         if (logConnection.assignedLogTypes.has(log.type))
            logConnection.SendLogsData({
               listType: log.type,
               logs: [LogWrapper.ToJson(log)]
            });
      }
   }
}
