import { Request, Response } from "express";
import { weatherQuerySchema } from "./weather.schema";
import { WeatherService } from "./weather.service";

export class WeatherController {
  static async current(req: Request, res: Response): Promise<void> {
    try {
      const validation = weatherQuerySchema.safeParse(req.query);

      if (!validation.success) {
        res.status(400).json({
          ok: false,
          message: "Parámetros inválidos.",
          errors: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const result = await WeatherService.getCurrentWeather(validation.data);

      res.status(200).json({
        ok: true,
        message: "Clima consultado correctamente.",
        data: result,
      });
    } catch (error: any) {
      res.status(502).json({
        ok: false,
        message: error.message || "Error consultando la API externa.",
      });
    }
  }
}
