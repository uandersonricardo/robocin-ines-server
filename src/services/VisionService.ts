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
    this.socket.subscribe("frame");

    console.log("Worker connected to vision");
  }

  private async receive() {
    for await (const [topic, msg] of this.socket) {
      const FrameProto = proto.lookupType("robocin.pb.ssl.vision.Frame");
      const frame = FrameProto.decode(msg).toJSON();
      const log = {
        matchId: match._id,
        type: "frame",
        data: frame,
        createdAt: new Date().toISOString(),
      };

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
