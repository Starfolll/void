import WebSocket from "ws";
import {WsListenerMethod} from "./wsTypes";


interface WsUserOnOpenListener {
   methodType: WsListenerMethod.open;
   cb: (event: { target: WebSocket }) => void,
   listenerName?: string;
}

interface WsUserOnMessageListener<ReplyData> {
   methodType: WsListenerMethod.message;
   cb: (event: { data: ReplyData; type: string; target: WebSocket }) => void
   listenerName?: string;
}

interface WsUserOnErrorListener {
   methodType: WsListenerMethod.error;
   cb: (event: { error: any, message: any, type: string, target: WebSocket }) => void
   listenerName?: string;
}

interface WsUserOnCloseListener {
   methodType: WsListenerMethod.close;
   cb: (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }) => void
   listenerName?: string;
}


export type wsUserListener<ReplyData> =
   WsUserOnOpenListener |
   WsUserOnMessageListener<ReplyData> |
   WsUserOnErrorListener |
   WsUserOnCloseListener;


export default class WsUser<SendData, ReplyData, CloseData> {
   protected socket: WebSocket;
   protected listeners = {
      open: {},
      message: {},
      error: {},
      close: {}
   } as Record<WsListenerMethod, Record<string, any>>;


   protected constructor(socket: WebSocket) {
      this.socket = socket;
   }


   public Send(data: SendData) {
      this.socket.send(JSON.stringify(data));
   }

   public Close(code: number, data: CloseData) {
      this.socket.close(code, JSON.stringify(data));
   }


   public AddListener(listener: wsUserListener<ReplyData>) {
      if (!!listener.listenerName) this.listeners[listener.methodType][listener.listenerName] = listener.cb;
      this.socket.addEventListener(listener.methodType, listener.cb as () => void);
   }

   public RemoveListener(method: WsListenerMethod, name: string) {
      if (!!this.listeners[method][name]) {
         this.socket.removeEventListener(method, this.listeners[method][name]);
         delete this.listeners[method][name];
      }
   }
}
