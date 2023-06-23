import "./config/mongo";

import app from "./app";
import refereeService from "./services/RefereeService";
import visionService from "./services/VisionService";
import webSocket from "./websocket";

refereeService.connect();
visionService.connect();

app.on("upgrade", (request, socket, head) => {
  webSocket.handleUpgrade(request, socket, head, (socket) => {
    webSocket.emit("connection", socket, request);
  });
});
