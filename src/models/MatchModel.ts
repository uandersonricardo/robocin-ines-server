import { Schema, model } from "mongoose";

const matchSchema = new Schema({
  firstPacketReceivedAt: {
    type: Date,
    default: Date.now,
  },
  lastPacketReceivedAt: {
    type: Date,
    default: Date.now,
  }
});

const matchModel = model("Match", matchSchema);

export default matchModel;
