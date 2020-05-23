import React from "react";
import {log} from "../../components/log";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


export default function UILog(props: {
   log: log
}) {
   return (
      <Grid container spacing={1} alignItems={"center"}>
         <Grid item>
            <Typography style={{color: "white"}} variant={"body2"}>
               {new Date(props.log.time).toUTCString()}
            </Typography>
         </Grid>
         <Grid item>
            <Typography style={{color: "white"}} variant={"body2"}>
               [ {props.log.type} ]
            </Typography>
         </Grid>
         <Grid item>
            <Typography style={{color: "white"}} variant={"body2"}>
               {props.log.data}
            </Typography>
         </Grid>
      </Grid>
   )
}
