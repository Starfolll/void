import React, {useEffect, useRef} from "react";
import {logList} from "../../components/logList";
import {Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import UILog from "./UILog";


export default function UILogList(props: { logList: logList }) {
   const messagesEndRef = useRef(null);

   useEffect(() => messagesEndRef.current.scrollIntoView({behavior: "smooth"}));

   return (
      <div>
         {props.logList.logs.map(log =>
            <Grid item key={log.id}>
               <Paper style={{padding: "5px"}}>
                  <UILog log={log}/>
               </Paper>
            </Grid>
         )}
      </div>
   );
};
