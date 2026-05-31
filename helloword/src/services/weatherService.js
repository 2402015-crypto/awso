import axios from "axios";

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
/**
 * obtener el clima actual de las coordenadas dadas
 * @param {float} lat latitud
 * @param {float} lon longitud
 * @returns (promise<{temperatura: float, viento: float}>)
 * 
 */


export async function obtenerClima(lat, lon) {
        const respuesta = await axios.get(BASE_URL,{
            params: {
                latitude: lat,
                longitude: lon,
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
     * Convierte el weather_code de Open-Meteo en un emoji y descripción legible
     * 
     * 
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