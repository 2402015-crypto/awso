import axios from "axios";

// Servicio HTTP para consultar datos relacionados con la aplicación del clima.
// - Usa Open-Meteo para obtener el clima actual.
// - Usa Nominatim (OpenStreetMap) para geocodificar nombres de ciudades.
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
/**
 * obtener el clima actual de las coordenadas dadas
 * @param {float} lat latitud
 * @param {float} lon longitud
 * @returns (promise<{temperatura: float, viento: float}>)
 * 
 */


/**
 * Obtener el clima actual para una lat/lon.
 * Retorna un objeto con las propiedades: { temperatura, viento, codigoClima }
 */
export async function obtenerClima(lat, lon) {
        const respuesta = await axios.get(BASE_URL,{
            params: {
                latitude: lat,
                longitude: lon,
                // La API de Open-Meteo admite diferentes parámetros; aquí
                // solicitamos las variables actuales del clima.
                current: 'temperature_2m,wind_speed_10m,weather_code',
                timezone: 'auto'
            }
        })

        const {temperature_2m, wind_speed_10m, weather_code} = respuesta.data.current
        return {
            temperatura: temperature_2m,
            viento: wind_speed_10m,
            codigoClima: weather_code
        }
    }

/**
 * Geocodifica el nombre de una ciudad a coordenadas usando Nominatim.
 * Retorna { nombre, latitud, longitud } o lanza un Error si no se encuentra.
 */
export async function obtenerCoordenadasCiudad(ciudad) {
    const respuesta = await axios.get(NOMINATIM_URL, {
        params: {
            q: ciudad,
            format: 'jsonv2',
            limit: 1,
        }
    })

    const resultado = respuesta.data?.[0]

    if (!resultado) {
        throw new Error('No se encontró la ciudad')
    }

    return {
        nombre: resultado.name || ciudad,
        latitud: Number.parseFloat(resultado.lat),
        longitud: Number.parseFloat(resultado.lon)
    }
}

/**
 * Interpreta el `weather_code` devuelto por Open-Meteo y devuelve
 * un objeto legible con `emoji` y `desc` para mostrar en la UI.
 *
 * Nota: la tabla de códigos puede ajustarse según la documentación de Open-Meteo.
 */
export function interpretarCOdigo(code) {
        if (code === 0) return {emoji: '☼', desc: 'Despejado'}
        if (code <= 3) return {emoji: '🌤', desc: 'Parcialmente nublado'}
        if (code <= 48) return {emoji: '🌫', desc: 'Niebla'}
        if (code <= 67) return {emoji: '🌧', desc: 'Lluvia'}
        if (code <= 77) return {emoji: '🌨', desc: 'Nieve'}
        if (code <= 82) return {emoji: '🌦', desc: 'Chubasco'}
        return {emoji: '⛈', desc: 'Tormenta'}

    }