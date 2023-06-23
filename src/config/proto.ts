import protobuf from "protobufjs";

const proto = protobuf.loadSync([
  "protos/duration.proto",
  "protos/timestamp.proto",
  "protos/common.proto",
  "protos/referee.proto",
  "protos/vision.proto",
]);

export default proto;
