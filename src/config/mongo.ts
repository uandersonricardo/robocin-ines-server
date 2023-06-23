import mongoose from "mongoose";

const MONGO_URI = "mongodb://root:root@localhost:27017/";

await mongoose.connect(MONGO_URI, { dbName: "ines" });
