import { LogModel } from "./log.model";
import { CreateLogDTO } from "./log.dto";
import { Request } from "express";
import axios from "axios";

class LogService {
  async createLog(req: Request, title: string, message: string): Promise<void> {
    try {
      let ip: string;
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        ip = response.data.ip;
      } catch (error) {
        ip =
          (req.headers["x-forwarded-for"] as string) ||
          req.connection.remoteAddress ||
          "Unknown IP";
      }
      const logData: CreateLogDTO = {
        ip,
        date: new Date(),
        title,
        message,
      };

      const log = new LogModel(logData);
      await log.save();
      console.log("Log created succefully:", log);
    } catch (error) {
      console.error("Errore during log creation:", error);
      throw new Error("Errore during log creation");
    }
  }

  async createSimpleLog(
    title: string,
    message: string,
    info?: any
  ): Promise<void> {
    try {
      let ip: string;
      const response = await axios.get("https://api.ipify.org?format=json");
      ip = response.data.ip;
      const logData: CreateLogDTO = {
        ip,
        date: new Date(),
        title,
        message,
      };

      const log = new LogModel(logData);
      await log.save();
      console.log("Log created succefully:", log);
    } catch (error) {
      console.error("Errore during log creation:", error);
      throw new Error("Errore during log creation");
    }
  }
}

export const logService = new LogService();
