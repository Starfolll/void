import React, {useState} from "react";
import {logList} from "../../components/logList";
import {Grid} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import UILog from "./UILog";
import {logType} from "../../components/log";


export default function UIServiceWindowLogger(props: {
   logLists: Array<logList>
}) {
   const [activeListType, setActiveList] = useState<logType>("INFO");

   return (
      <Grid container style={{height: "100%"}} spacing={1}>
         <Grid item>
            <Paper style={{background: "rgba(255,255,255,0.2)", padding: "5px", height: "100%"}}>
               <Grid container direction={"column"} spacing={1}>
                  {props.logLists.map(list => <Grid item key={list.listType}>
                     <Button
                        fullWidth variant={"contained"} color={"primary"}
                        onClick={() => setActiveList(list.listType)}
                     >
                        {list.listType}
                     </Button>
                  </Grid>)}
               </Grid>
            </Paper>
         </Grid>
         <Grid item xs>
            <Paper style={{background: "rgba(255,255,255,0.2)", padding: "5px", height: "100%"}}>
               <Grid container direction={"column"} style={{overflowY: "auto", overflowX: "hidden"}}>
                  {props.logLists.filter(list => list.listType === activeListType)[0]
                     .logs.map(log => <Grid item key={log.id}>
                        <UILog log={log}/>
                     </Grid>)
                  }
               </Grid>
            </Paper>
         </Grid>
      </Grid>
   );
}
