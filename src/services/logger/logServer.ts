import Joi from "joi";
import express from "express";
import {logType} from "./components/log";
import LogServe from "./components/logServe";


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
   app.get("/*", async (req, res) => res.send(`
        <div style="font-family: monospace">
            <p>LOG SERVE</p>
            <hr/>
            <a href="/log/get/json/" style="color: black">ALL</a>
            <hr/>
            <a href="/log/get/json/info" style="color: black">INFO</a>
            <a href="/log/get/json/debug" style="color: black">DEBUG</a>
            <a href="/log/get/json/error" style="color: black">ERROR</a>
            <a href="/log/get/json/fatal" style="color: black">FATAL</a>
            <a href="/log/get/json/trace" style="color: black">TRACE</a>
            <a href="/log/get/json/warn" style="color: black">WARN</a>
        </div>
   `));


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


   app.listen(serverPort, () => {
      logServe.AddLog("INFO", "Log server is up and running");
   });
};

main().then();
