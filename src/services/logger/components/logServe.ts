import {LogList} from "./logList";
import {allLogsType, Log, logType} from "./log";
import WebSocket from "ws";
import LogConnection from "./logConnection";
import uniqId from "uniqid";
import Joi from "joi";


const SUBSCRIBE_TO_LOG = "SUBSCRIBE_TO_LOG";
const UNSUBSCRIBE_FROM_LOG = "UNSUBSCRIBE_FROM_LOG";
const GET_LOG_LIST = "GET_LOG_LIST";

interface ConnectionSubscribeToLogs {
   messageType: typeof SUBSCRIBE_TO_LOG;
   logsType: Array<logType>;
}

interface ConnectionUnsubscribeFromLogs {
   messageType: typeof UNSUBSCRIBE_FROM_LOG;
   logsType: Array<logType>;
}

interface ConnectionGetLogList {
   messageType: typeof GET_LOG_LIST;
   logsType: Array<logType>;
}

export type logServerWSConnectionActions =
   ConnectionSubscribeToLogs |
   ConnectionUnsubscribeFromLogs |
   ConnectionGetLogList;


export default class LogServe {
   private readonly wsPort: number;
   private readonly logConnections: { [uniqid: string]: LogConnection } = {};

   public readonly logsList = {
      INFO: new LogList({listType: "INFO"}),
      DEBUG: new LogList({listType: "DEBUG"}),
      ERROR: new LogList({listType: "ERROR"}),
      FATAL: new LogList({listType: "FATAL"}),
      TRACE: new LogList({listType: "TRACE"}),
      WARN: new LogList({listType: "WARN"}),
   };


   constructor(props: {
      wsPort: number
   }) {
      this.wsPort = props.wsPort;

      const wsServer = new WebSocket.Server({port: this.wsPort});
      wsServer.on("connection", (connection: WebSocket) => {
         const connectionUniqId = uniqId(`${Math.random() * 1000000000 | 0}`);
         this.logConnections[connectionUniqId] = new LogConnection(connection);

         connection.on("message", async (event: string) => {
            const data: logServerWSConnectionActions = JSON.parse(event);
            const dataSchema = Joi.object({
               messageType: Joi.string().required(),
               logsType: Joi.array().required()
            });

            if (!!dataSchema.validate(data).error) return;

            switch (data.messageType) {
               case "GET_LOG_LIST":
                  const logsBundle = this.GetLogsBundle(data.logsType);
                  this.logConnections[connectionUniqId].SendLogsData(logsBundle.listType, logsBundle.GetLogs());
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


   public GetLogsBundle(logsType?: Array<logType>): LogList {
      const types = !!logsType ? new Set<logType>(logsType) : null;
      let logs: Array<Log> = [];

      if (types?.has("ALL")) allLogsType.forEach((t: logType) => {
         if (t !== "ALL") logs.push(...this.logsList[t].GetLogs())
      });
      else allLogsType.forEach((t: logType) => {
         if (t !== "ALL" && types?.has(t)) logs.push(...this.logsList[t].GetLogs())
      });

      return new LogList({listType: "ALL", logs});
   }

   public AddLog(logType: logType, data: string) {
      if (logType !== "ALL") {
         const newLog = new Log({type: logType, data});
         console.log(newLog.ToConsoleString());

         this.logsList[logType].AddLog(newLog);
         this.SendLogToConnections(newLog);
      }
   }

   private SendLogToConnections(log: Log) {
      for (let connection in this.logConnections) {
         const logConnection = this.logConnections[connection];

         if (logConnection.assignedLogTypes.has(log.type))
            logConnection.SendLogsData(log.type, [log.ToJson()]);
      }
   }
}
