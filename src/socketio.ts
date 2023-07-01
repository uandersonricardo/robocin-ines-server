import { Server } from "socket.io";

import { match } from "./config/state";
import logModel from "./models/LogModel";
import app from "./app";
import matchModel from "./models/MatchModel";

class SocketIO {
  private server: Server;

  constructor() {
    this.server = new Server(app.getServer(), { cors: { origin: "*" } });
    this.receive();
  }

  public getServer() {
    return this.server;
  }

  public broadcast(msg: any) {
    this.server.to("live").emit("message", msg);
  }

  private receive() {
    this.server.on("connection", (socket) => {
      socket.send(match?.toJSON());
    
      socket.on("message", (message) => {
        if (message.command === "get-chunk") {
          const lastTimestamp = message.lastTimestamp;
          const query: any = { matchId: match?._id };
    
          if (lastTimestamp) {
            query.createdAt = { $gt: lastTimestamp };
          }
    
          logModel.find(query).sort({ createdAt: 1 }).limit(2000).then(async (logs) => {
            const updatedMatch = await matchModel.findById(match?._id);
            socket.send({ matchId: match?._id, match: updatedMatch, type: "chunk", data: logs });
          });
        } else if (message.command === "subscribe-live") {
          socket.join("live");
        } else if (message.command === "unsubscribe-live") {
          socket.leave("live");
        }
    
        console.log(message);
      });
    });
  }
}

const socketIo = new SocketIO();

export default socketIo;
