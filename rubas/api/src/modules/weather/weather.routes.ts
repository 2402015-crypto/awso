import { Router } from "express";
import { WeatherController } from "./weather.controller";

const router = Router();

router.get("/current", WeatherController.current);

export default router;
