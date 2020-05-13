import chalk from "chalk";


export type logType = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "TRACE" | "ALL";
export const allLogsType: Set<logType> = new Set<logType>(["DEBUG", "INFO", "WARN", "ERROR", "FATAL", "TRACE", "ALL"]);
export type log = {
   type: logType,
   time: Date,
   data: string
};

export class Log {
   public readonly type: logType;
   public readonly time: Date = new Date(Date.now());
   public readonly data: string;

   constructor(props: {
      type: logType,
      data: string,
      time?: Date
   }) {
      this.type = props.type;
      this.data = props.data;

      if (props.time) this.time = new Date(props.time);
   }


   private WrapStringToLogColor(data: string) {
      switch (this.type) {
         case "ALL":
            return data;

         case "INFO":
            return chalk.blueBright(data);

         case "DEBUG":
         case "TRACE":
            return chalk.greenBright(data);

         case "WARN":
            return chalk.yellowBright(data);

         case "ERROR":
         case "FATAL":
            return chalk.redBright(data);
      }
   }

   public ToConsoleString(): string {
      return `[${this.time.toUTCString()}] [${this.WrapStringToLogColor(this.type.padEnd(5))}] ${this.data}`;
   }

   public ToString(): string {
      return `[${this.time.toUTCString()}] [${this.type.padEnd(5)}] ${this.data}`;
   }

   public ToJson(): log {
      return {
         data: this.data,
         time: this.time,
         type: this.type
      };
   }
}
