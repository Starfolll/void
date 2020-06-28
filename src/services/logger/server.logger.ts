import express from "express";
import {LogInput, LogType} from "./components/log";
import LogServe from "./components/logServe";
import Env from "../../../env/env";
import Joi from "joi";


// http://www.tutorialspoint.com/log4j/log4j_logging_levels.htm


const app = express();
const logServe = new LogServe(Env.services.logger.ports.loggerServerWsPort, {
   ALL: {listInit: {logsLimit: 1000}},
   DEBUG: {listInit: {logsLimit: 1000}},
   ERROR: {listInit: {logsLimit: 1000}},
   FATAL: {listInit: {logsLimit: 1000}},
   INFO: {listInit: {logsLimit: 1000}},
   TRACE: {listInit: {logsLimit: 1000}},
   WARN: {listInit: {logsLimit: 1000}}
});


(async () => {
   app.use(express.json());

   app.get("/stats/serverId", async (req, res) => res.json(Env.services.logger.serverId));

   app.get("/log/get/json/info", async (req, res) => res.json(logServe.logsList.INFO.ToJson()));
   app.get("/log/get/json/debug", async (req, res) => res.json(logServe.logsList.DEBUG.ToJson()));
   app.get("/log/get/json/error", async (req, res) => res.json(logServe.logsList.ERROR.ToJson()));
   app.get("/log/get/json/fatal", async (req, res) => res.json(logServe.logsList.FATAL.ToJson()));
   app.get("/log/get/json/trace", async (req, res) => res.json(logServe.logsList.TRACE.ToJson()));
   app.get("/log/get/json/warn", async (req, res) => res.json(logServe.logsList.WARN.ToJson()));
   app.get("/log/get/json/*", async (req, res) => res.json(logServe.GetLogsBundle([LogType.ALL]).ToJson()));

   app.post("/log/add", async (req: any, res: any) => {
      const body: LogInput = req.body;

      const isValid = Joi.object({
         id: Joi.string(),
         time: Joi.number(),
         data: Joi.string().required(),
         type: Joi.string().required(),
         serverId: Joi.string().required()
      }).validate(body);

      if (!isValid.error) logServe.AddLog(body);
      else res.status(422);

      res.send();
   });

   app.listen(Env.services.logger.ports.loggerServerPort, () => {
      logServe.AddLog({
         type: LogType.INFO,
         data: Env.upAndRunningMessage,
         serverId: Env.services.logger.serverId
      });
   });
})();
