import { WebSocketServer } from "ws";

import { match } from "./config/state";
import logModel from "./models/LogModel";

class WebSocket {
  private server;

  constructor() {
    this.server = new WebSocketServer({ noServer: true });
    this.bindEvents();
  }

  public getServer() {
    return this.server;
  }

  private bindEvents() {
    this.server.on("connection", (socket) => {
      console.log(this.server);
    
      socket.send(JSON.stringify(match?.toJSON()));
    
      socket.on("message", (e) => {
        const message = JSON.parse(e.toString());
    
        if (message.command === "get-chunk") {
          const lastTimestamp = message.lastTimestamp;
          const query: any = { matchId: match?._id };
    
          if (lastTimestamp) {
            query.createdAt = { $gt: lastTimestamp };
          }
    
          logModel.find(query).sort({ createdAt: 1 }).limit(500).then((logs) => {
            socket.send(JSON.stringify({ type: "chunk", data: logs }));
          });
        }
    
        console.log(message);
      });
    });
  }
}

const webSocket = new WebSocket().getServer();

export default webSocket;
