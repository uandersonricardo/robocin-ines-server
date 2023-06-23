import path from "path";
import zmq from "zeromq";

import proto from "../config/proto";
import logModel from "../models/LogModel";
import { match } from "../config/state";
import webSocket from "../websocket";
import fileDirName from "../utils/fileDirName";

class RefereeService {
  private socket;

  constructor() {
    this.socket = zmq.socket("sub");
    this.bindEvents();
  }

  public connect() {
    const { __dirname } = fileDirName(import.meta.url);
    const location = path.join(__dirname, "../../../ipc-test/referee.ipc");
    this.socket.connect(`ipc://${location}`);
    this.socket.subscribe("status");

    console.log("Worker connected to referee");
  }

  private bindEvents() {
    this.socket.on("message", async (topic, msg) => {
      const StatusProto = proto.lookupType("ines.referee.Status");
      const status = StatusProto.decode(msg).toJSON();
  
      // webSocket.clients.forEach((client) => {
      //   client.send(JSON.stringify(status));
      // });

      if (!match) {
        return;
      }
  
      await logModel.create({
        matchId: match._id,
        type: "status",
        data: status
      });
  
      console.dir(status, { depth: null });
      
      await match.updateOne({ lastPacketReceivedAt: Date.now() });
    });
  }
}

const refereeService = new RefereeService();

export default refereeService;
