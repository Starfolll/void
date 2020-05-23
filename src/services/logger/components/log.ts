import uniqId from "uniqid";


export type logType = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "TRACE" | "ALL";
export const allLogsType: Set<logType> = new Set<logType>(["DEBUG", "INFO", "WARN", "ERROR", "FATAL", "TRACE", "ALL"]);
export type log = {
   type: logType,
   time: Date,
   data: string,
   id: string
};

export class Log {
   public readonly type: logType;
   public readonly time: Date = new Date(Date.now());
   public readonly data: string;
   public readonly id: string;


   constructor(props: {
      type: logType,
      data: string,
      time?: Date,
      id?: string
   }) {
      this.type = props.type;
      this.data = props.data;
      this.id = !!props.id ? props.id : uniqId(undefined, `-${(Math.random() * 1000000 | 0)}`);

      if (props.time) this.time = new Date(props.time);
   }
}
