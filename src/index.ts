import "./config/mongo";

import app from "./app";
import refereeService from "./services/RefereeService";
import visionService from "./services/VisionService";
import socketIo from "./socketio";

refereeService.connect();
visionService.connect();
