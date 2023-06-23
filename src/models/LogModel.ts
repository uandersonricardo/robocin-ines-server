import { Schema, model } from "mongoose";

const logSchema = new Schema({
  matchId: {
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
  },
  data: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const logModel = model("Log", logSchema);

export default logModel;
