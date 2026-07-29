import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import weatherRoutes from "./modules/weather/weather.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true,
};

// Middlewares Globales
app.use(express.json());
app.use(cookieParser()); // Permite a Express leer req.cookies
app.use(cors(corsOptions));

// Rutas de la API
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/weather", weatherRoutes);

// Healthcheck
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, mensaje: "API Ruba Studio activa" });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
