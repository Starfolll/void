import Joi from "joi";
import express from "express";
import {logType} from "./components/log";
import LogServe from "./components/logServe";
import LogServerRequest from "./logServerRequest";


// http://www.tutorialspoint.com/log4j/log4j_logging_levels.htm


const app = express();
const serverPort = 8888;

const logServe = new LogServe({wsPort: 8889});
const bodyValidationSchema = Joi.object({data: Joi.string().required()});

const main = async () => {
   app.use(express.json());
   app.use(express.static(__dirname + "/web/dist"));

   app.get("/log/get/json/info", async (req, res) => res.json(logServe.logsList.INFO.ToJson()));
   app.get("/log/get/json/debug", async (req, res) => res.json(logServe.logsList.DEBUG.ToJson()));
   app.get("/log/get/json/error", async (req, res) => res.json(logServe.logsList.ERROR.ToJson()));
   app.get("/log/get/json/fatal", async (req, res) => res.json(logServe.logsList.FATAL.ToJson()));
   app.get("/log/get/json/trace", async (req, res) => res.json(logServe.logsList.TRACE.ToJson()));
   app.get("/log/get/json/warn", async (req, res) => res.json(logServe.logsList.WARN.ToJson()));
   app.get("/log/get/json/*", async (req, res) => res.json(logServe.GetLogsBundle(["ALL"]).ToJson()));
   app.get("/*", async (req, res) => res.send(`<div style="font-family: monospace"><p>404</p></div>`));


   const addLog = (req: any, res: any, logType: logType) => {
      const body: { data: string } = req.body;

      if (!(bodyValidationSchema.validate(body).error)) {
         if (logType !== "ALL") logServe.AddLog(logType, body.data);
         res.send();
      } else res.status(503).send();
   };
   app.post("/log/add/info", async (req: any, res: any) => addLog(req, res, "INFO"));
   app.post("/log/add/debug", async (req: any, res: any) => addLog(req, res, "DEBUG"));
   app.post("/log/add/error", async (req: any, res: any) => addLog(req, res, "ERROR"));
   app.post("/log/add/warn", async (req: any, res: any) => addLog(req, res, "WARN"));
   app.post("/log/add/trace", async (req: any, res: any) => addLog(req, res, "TRACE"));
   app.post("/log/add/fatal", async (req: any, res: any) => addLog(req, res, "FATAL"));
   app.post("/*", async (req: any, res: any) => {
      console.log(req.body);
      res.send();
   });

   app.listen(serverPort);

   setInterval(() => LogServerRequest.AddLog("INFO", Math.random().toString()), 3000);
   // setInterval(() => LogServerRequest.AddLog("DEBUG", Math.random().toString()), 1000);
};

main().then();
