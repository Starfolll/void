import WebSocket from "ws";
import http from "http";
import {WsListenerMethod} from "./wsTypes";
import {wsUserListener} from "./wsUser";


interface WsCommunicatorOnConnectionListener {
   methodType: WsListenerMethod.connection;
   cb: (this: WebSocket, headers: string[], request: http.IncomingMessage) => void;
   listenerName?: string;
}

interface WsCommunicatorOnErrorListener {
   methodType: WsListenerMethod.error;
   cb: (this: WebSocket, error: Error) => void;
   listenerName?: string;
}

interface WsCommunicatorOnListeningListener {
   methodType: WsListenerMethod.listening;
   cb: (this: WebSocket) => void;
   listenerName?: string;
}

export type wsCommunicatorListener =
   WsCommunicatorOnConnectionListener |
   WsCommunicatorOnErrorListener |
   WsCommunicatorOnListeningListener;


export interface WsCommunicatorConfigs {

}


export default abstract class WsCommunicator<ReplyData> {
   private readonly wsCommunicatorConfigs: WsCommunicatorConfigs;
   private readonly server: WebSocket.Server;
   private readonly listeners = {
      connection: {},
      error: {},
      listening: {}
   } as Record<WsListenerMethod, Record<string, any>>
   private readonly clientListeners = {
      open: {},
      message: {},
      error: {},
      close: {}
   } as Record<WsListenerMethod, Record<string, any>>


   protected constructor(server: WebSocket.Server, wsCommunicatorConfigs: WsCommunicatorConfigs) {
      this.wsCommunicatorConfigs = wsCommunicatorConfigs;
      this.server = server;
   }


   public abstract ApplyListeners(): void;

   public abstract ApplyClientListeners(): void;


   protected AddClientSetupListener(listener: wsUserListener<ReplyData>) {
      if (!!listener.listenerName) this.clientListeners[listener.methodType][listener.listenerName] = listener.cb;
   }

   protected RemoveClientSetupListener(method: WsListenerMethod, name: string) {
      if (!!this.listeners[method][name]) {
         delete this.clientListeners[method][name];
      }
   }


   protected AddListener(listener: wsCommunicatorListener) {
      if (!!listener.listenerName) this.listeners[listener.methodType][listener.listenerName] = listener.cb;
      this.server.addListener(listener.methodType, listener.cb as () => void);
   }

   protected RemoveListener(method: WsListenerMethod, name: string) {
      if (!!this.listeners[method][name]) {
         this.server.removeListener(method, this.listeners[method][name]);
         delete this.listeners[method][name];
      }
   }
}

