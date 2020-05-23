import React, {useEffect, useState} from "react";
import logServerRequest from "../../logServerRequest";
import {logList} from "../../components/logList";
import {log, logType} from "../../components/log";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import UIServiceIcon, {serviceType} from "./UIServiceIcon";
import UIServiceWindowLogger from "./UIServiceWindow.logger";
import {IconButton} from "@material-ui/core";


export default function App() {
   // const messagesEndRef = useRef(null);

   const [activeServiceTab, setActiveServiceTab] = useState<serviceType>("logger");

   const [infoLogLists, setInfoLogLists] = useState<logList>({listType: "INFO", logs: []});
   const [debugLogLists, setDebugLogLists] = useState<logList>({listType: "DEBUG", logs: []});
   const [errorLogLists, setErrorLogLists] = useState<logList>({listType: "ERROR", logs: []});
   const [fatalLogLists, setFatalLogLists] = useState<logList>({listType: "FATAL", logs: []});
   const [traceLogLists, setTraceLogLists] = useState<logList>({listType: "TRACE", logs: []});
   const [warnLogLists, setWarnLogLists] = useState<logList>({listType: "WARN", logs: []});

   const addLogToList = (listType: logType, log: Array<log>) => {
      const getMergedLogList = (list: logList) => ({
         listType: list.listType,
         logs: [...list.logs, ...log]
      })

      switch (listType) {
         case "DEBUG":
            return setDebugLogLists(list => getMergedLogList(list));

         case "ERROR":
            return setErrorLogLists(list => getMergedLogList(list));

         case "FATAL":
            return setFatalLogLists(list => getMergedLogList(list));

         case "INFO":
            return setInfoLogLists(list => getMergedLogList(list));

         case "TRACE":
            return setTraceLogLists(list => getMergedLogList(list));

         case "WARN":
            return setWarnLogLists(list => getMergedLogList(list));
      }
   }

   // useEffect(() => messagesEndRef.current.scrollIntoView({behavior: "smooth"}));
   useEffect(() => {
      const connection = new WebSocket("ws://localhost:8889/");

      connection.onopen = () => logServerRequest.WSSubscribeToLogs(connection, ["ALL"])
         .then(r => logServerRequest.WSGetLogsList(connection, ["ALL"]));

      connection.onmessage = (e) => {
         const list = JSON.parse(e.data) as logList;
         if (list.listType === "ALL") {
            console.time("separating");
            const logsList: Record<logType, Array<log>> = {
               "INFO": [], "DEBUG": [], "ERROR": [],
               "FATAL": [], "TRACE": [], "WARN": [], "ALL": []
            }

            for (const log of list.logs) logsList[log.type].push(log);
            console.timeLog("separating");

            (Object.keys(logsList) as Array<logType>).forEach(logType => {
               addLogToList(logType, logsList[logType]);
               delete logsList[logType];
            });

         } else addLogToList(list.listType, list.logs);
      }
   }, []);

   return (
      <Box style={{
         position: "fixed", top: 0, left: 0,
         background: "rgb(0,0,0)",
         height: "calc(100% - 20px)", width: "calc(100% - 20px)",
         padding: "10px"
      }}>
         <Grid container spacing={1} style={{height: "100%"}}>
            <Grid item>
               <Box style={{height: "100%"}}>
                  <Grid direction={"column"} container spacing={1}>
                     <Grid item>
                        <IconButton>
                           <UIServiceIcon serviceType={"logger"}/>
                        </IconButton>
                     </Grid>
                     <Grid item>
                        <IconButton>
                           <UIServiceIcon serviceType={"serverStats"}/>
                        </IconButton>
                     </Grid>
                  </Grid>
               </Box>
            </Grid>
            <Grid item xs>
               <UIServiceWindowLogger logLists={[
                  infoLogLists, debugLogLists, errorLogLists,
                  fatalLogLists, traceLogLists, warnLogLists
               ]}/>
            </Grid>
            {/*<div ref={messagesEndRef}/>*/}
         </Grid>
      </Box>
   );
}
