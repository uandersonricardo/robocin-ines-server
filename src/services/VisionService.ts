import path from "path";
import zmq from "zeromq";

import { match } from "../config/state";
import proto from "../config/proto";
import logModel from "../models/LogModel";
import webSocket from "../websocket";
import fileDirName from "../utils/fileDirName";

class VisionService {
  private socket;

  constructor() {
    this.socket = zmq.socket("sub");
    this.bindEvents();
  }

  public connect() {
    const { __dirname } = fileDirName(import.meta.url);
    const location = path.join(__dirname, "../../../ipc-test/vision.ipc");
    this.socket.connect(`ipc://${location}`);
    this.socket.subscribe("vision");
    this.socket.subscribe("field");

    console.log("Worker connected to vision");
  }

  private bindEvents() {
    this.socket.on("message", async (topic, msg) => {
      let log = {};

      if (topic.toString() === "vision") {
        const FrameProto = proto.lookupType("ines.vision.Frame");
        const frame = FrameProto.decode(msg).toJSON();
    
        // webSocket.clients.forEach((client) => {
        //   client.send(JSON.stringify(frame));
        // });
    
        log = {
          type: "frame",
          data: frame
        }
    
        console.dir(frame, { depth: null });
      } else if (topic.toString() === "field") {
        const FieldProto = proto.lookupType("ines.vision.Field");
        const field = FieldProto.decode(msg).toJSON();
    
        // wsServer.clients.forEach((client) => {
        //   client.send(JSON.stringify(field));
        // });
    
        log = {
          type: "field",
          data: field
        };
    
        console.dir(field, { depth: null });
      }

      if (!match) {
        return;
      }

      await logModel.create({
        matchId: match._id,
        ...log
      });
  
      await match.updateOne({ lastPacketReceivedAt: Date.now() });
    });
  }
}

const visionService = new VisionService();

export default visionService;
