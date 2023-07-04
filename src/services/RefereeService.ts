import path from "path";
import { Subscriber } from "zeromq";

import proto from "../config/proto";
import logModel from "../models/LogModel";
import { match } from "../config/state";
import fileDirName from "../utils/fileDirName";
import socketIo from "../socketio";

class RefereeService {
  private socket;

  constructor() {
    this.socket = new Subscriber();
    this.receive();
  }

  public connect() {
    const { __dirname } = fileDirName(import.meta.url);
    const location = path.join(__dirname, "../../../ipc-test/referee.ipc");
    this.socket.connect(`ipc://${location}`);
    this.socket.subscribe("referee");

    console.log("Worker connected to referee");
  }

  private async receive() {
    for await (const [topic, msg] of this.socket) {
      const RefereeProto = proto.lookupType(
        "robocin.pb.ssl.third_party.game_controller.Referee"
      );
      const referee = RefereeProto.decode(msg).toJSON();
      const log = {
        matchId: match._id,
        type: "referee",
        data: referee,
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

const refereeService = new RefereeService();

export default refereeService;
