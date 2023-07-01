import express from "express";
import cors from "cors";

class App {
  private app;
  private server;

  constructor() {
    this.app = express();
    this.middlewares();
    this.listen();
  }

  public getServer() {
    return this.server;
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private listen() {
    this.server = this.app.listen(3333, () => {
      console.log("Server started on port 3333");
    });
  }
}

const app = new App();

export default app;
