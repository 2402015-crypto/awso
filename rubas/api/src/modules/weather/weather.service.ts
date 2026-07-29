import { WeatherQueryInput } from "./weather.schema";

type OpenMeteoCurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
};

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  timezone: string;
  current_weather?: OpenMeteoCurrentWeather;
};

export class WeatherService {
  static async getCurrentWeather(query: WeatherQueryInput) {
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", String(query.latitude));
    endpoint.searchParams.set("longitude", String(query.longitude));
    endpoint.searchParams.set("current_weather", "true");
    endpoint.searchParams.set("timezone", query.timezone || "auto");

    const response = await fetch(endpoint.toString());

    if (!response.ok) {
      throw new Error("No fue posible consultar Open-Meteo.");
    }

    const data = (await response.json()) as OpenMeteoResponse;

    if (!data.current_weather) {
      throw new Error(
        "La API externa no devolvió información meteorológica actual.",
      );
    }

    return {
      provider: "open-meteo",
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      },
      current: data.current_weather,
    };
  }
}
