import React from "react";
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';


export type serviceType = "logger" | "serverStats";
export default function UIServiceIcon(props: { serviceType: serviceType }) {
   switch (props.serviceType) {
      case "serverStats":
      case "logger":
         return (
            // <Paper style={{background: "rgba(255,255,255,0.2)", padding: "5px"}}>
            <FormatAlignLeftIcon color={"secondary"} fontSize={"large"}/>
            // </Paper>
         )
   }
};
