import protobuf from "protobufjs";

const proto = protobuf.loadSync([
  "protos/google/any.proto",
  "protos/google/duration.proto",
  "protos/google/timestamp.proto",
  "protos/robocin/pb/utility/geometry.proto",
  "protos/robocin/pb/ssl/third_party/detection/geometry.proto",
  "protos/robocin/pb/ssl/third_party/detection/raw.proto",
  "protos/robocin/pb/ssl/third_party/detection/raw_wrapper.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/common.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/event.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/geometry.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/referee.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/tracked.proto",
  "protos/robocin/pb/ssl/third_party/game_controller/tracked_wrapper.proto",
  "protos/robocin/pb/ssl/third_party/simulation/config.proto",
  "protos/robocin/pb/ssl/third_party/simulation/control.proto",
  "protos/robocin/pb/ssl/third_party/simulation/error.proto",
  "protos/robocin/pb/ssl/third_party/simulation/robot_control.proto",
  "protos/robocin/pb/ssl/third_party/simulation/robot_feedback.proto",
  "protos/robocin/pb/ssl/third_party/simulation/synchronous.proto",
  "protos/robocin/pb/ssl/third_party/simulation/erforce/custom_realism.proto",
  "protos/robocin/pb/ssl/third_party/simulation/erforce/custom_robot_specs.proto",
  "protos/robocin/pb/ssl/vision/ball.proto",
  "protos/robocin/pb/ssl/vision/field.proto",
  "protos/robocin/pb/ssl/vision/robot.proto",
  "protos/robocin/pb/ssl/vision/frame.proto",
]);

export default proto;
