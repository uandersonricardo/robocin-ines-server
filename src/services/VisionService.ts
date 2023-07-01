import path from "path";
import zmq from "zeromq";

import { match } from "../config/state";
import proto from "../config/proto";
import logModel from "../models/LogModel";
import fileDirName from "../utils/fileDirName";
import socketIo from "../socketio";

class VisionService {
  private socket;

  constructor() {
    this.socket = new zmq.Subscriber();
    this.receive();
  }

  public connect() {
    const { __dirname } = fileDirName(import.meta.url);
    const location = path.join(__dirname, "../../../ipc-test/vision.ipc");
    this.socket.connect(`ipc://${location}`);
    this.socket.subscribe("vision");
    this.socket.subscribe("field");

    console.log("Worker connected to vision");
  }

  private async receive() {
    for await (const [topic, msg] of this.socket) {
      let log = {};

      if (topic.toString() === "vision") {
        const FrameProto = proto.lookupType("ines.vision.Frame");
        const frame = FrameProto.decode(msg).toJSON();
    
        log = {
          matchId: match._id,
          type: "frame",
          data: frame
        };
      } else if (topic.toString() === "field") {
        const FieldProto = proto.lookupType("ines.vision.Field");
        const field = FieldProto.decode(msg).toJSON();

        log = {
          matchId: match._id,
          type: "field",
          data: field
        };
      }
    
      socketIo.broadcast(log);

      if (!match) {
        return;
      }

      await logModel.create(log);
      await match.updateOne({ lastPacketReceivedAt: Date.now() });
    }
  }
}

const visionService = new VisionService();

export default visionService;
