import express from "express";
import {LogInput, LogType} from "./components/log";
import LogServe from "./components/logServe";
import Env from "../../../env/env";
import Joi from "joi";


// http://www.tutorialspoint.com/log4j/log4j_logging_levels.htm


const app = express();
const logServe = new LogServe(Env.logger.ports.loggerServerWsPort, {
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

   app.get("/stats/serverId", async (req, res) => res.json(Env.logger.serverId));

   app.get("/log/get/html/info", async (req, res) => res.send(logServe.logsList.INFO.ToHTML()));
   app.get("/log/get/html/debug", async (req, res) => res.send(logServe.logsList.DEBUG.ToHTML()));
   app.get("/log/get/html/error", async (req, res) => res.send(logServe.logsList.ERROR.ToHTML()));
   app.get("/log/get/html/fatal", async (req, res) => res.send(logServe.logsList.FATAL.ToHTML()));
   app.get("/log/get/html/trace", async (req, res) => res.send(logServe.logsList.TRACE.ToHTML()));
   app.get("/log/get/html/warn", async (req, res) => res.send(logServe.logsList.WARN.ToHTML()));
   app.get("/log/get/html/*", async (req, res) => res.send(logServe.GetLogsBundle([LogType.ALL]).ToHTML()));

   app.get("/log/get/json/info", async (req, res) => res.json(logServe.logsList.INFO.ToJson()));
   app.get("/log/get/json/debug", async (req, res) => res.json(logServe.logsList.DEBUG.ToJson()));
   app.get("/log/get/json/error", async (req, res) => res.json(logServe.logsList.ERROR.ToJson()));
   app.get("/log/get/json/fatal", async (req, res) => res.json(logServe.logsList.FATAL.ToJson()));
   app.get("/log/get/json/trace", async (req, res) => res.json(logServe.logsList.TRACE.ToJson()));
   app.get("/log/get/json/warn", async (req, res) => res.json(logServe.logsList.WARN.ToJson()));
   app.get("/log/get/json/*", async (req, res) => res.json(logServe.GetLogsBundle([LogType.ALL]).ToJson()));

   app.get("/*", async (req, res) => res.send(`
        <div style="font-family: monospace">
            <p>LOG SERVE</p>
            <hr/>
            <hr/>
            <p style="background: black; color: white">HTML</p>
            <p><a href="/log/get/html/" style="color: black">ALL</a></p>
            <p><a href="/log/get/html/info" style="color: black">INFO</a></p>
            <p><a href="/log/get/html/debug" style="color: black">DEBUG</a></p>
            <p><a href="/log/get/html/error" style="color: black">ERROR</a></p>
            <p><a href="/log/get/html/fatal" style="color: black">FATAL</a></p>
            <p><a href="/log/get/html/trace" style="color: black">TRACE</a></p>
            <p><a href="/log/get/html/warn" style="color: black">WARN</a></p>
            <hr/>
            <p style="background: black; color: white">JSON</p>
            <p><a href="/log/get/json/" style="color: black">ALL</a></p>
            <p><a href="/log/get/json/info" style="color: black">INFO</a></p>
            <p><a href="/log/get/json/debug" style="color: black">DEBUG</a></p>
            <p><a href="/log/get/json/error" style="color: black">ERROR</a></p>
            <p><a href="/log/get/json/fatal" style="color: black">FATAL</a></p>
            <p><a href="/log/get/json/trace" style="color: black">TRACE</a></p>
            <p><a href="/log/get/json/warn" style="color: black">WARN</a></p>
        </div>
   `));

   app.post("/log/add", async (req: any, res: any) => {
      const body: LogInput = req.body;

      const isValid = Joi.object({
         id: Joi.string(),
         time: Joi.number(),
         data: Joi.string().required(),
         type: Joi.string().required(),
         serverId: Joi.string().required()
      }).validate(body);

      console.log(isValid);

      if (!isValid.error) logServe.AddLog(body);
      else res.status(422);

      res.send();
   });

   app.listen(Env.logger.ports.loggerServerPort, () => {
      logServe.AddLog({
         type: LogType.INFO,
         data: Env.upAndRunningMessage,
         serverId: Env.logger.serverId
      });
   });
})();
