import { z } from "zod";

export const weatherQuerySchema = z.object({
  latitude: z.coerce
    .number({ message: "La latitud es obligatoria." })
    .min(-90, "La latitud debe estar entre -90 y 90.")
    .max(90, "La latitud debe estar entre -90 y 90."),
  longitude: z.coerce
    .number({ message: "La longitud es obligatoria." })
    .min(-180, "La longitud debe estar entre -180 y 180.")
    .max(180, "La longitud debe estar entre -180 y 180."),
  timezone: z.string().trim().min(1).optional(),
});

export type WeatherQueryInput = z.infer<typeof weatherQuerySchema>;
