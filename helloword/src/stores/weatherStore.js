import { defineStore } from 'pinia'
import { ref, computed, reactive } from "vue"
import {interpretarCOdigo} from "@/services/weatherService"

// Store: weather
// Responsable de mantener el estado global relacionado con el clima.
// Estado principal:
// - ciudad, latitud, longitud: ubicación seleccionada
// - clima: objeto reactive con temperatura, viento, codigoClima, ultimaActualizacion
// - cargando, error: flags para la UI
// Provee getters computados para presentación y acciones para actualizar el estado.

export const useWeatherStore = defineStore('weather', () => {
    // Estados
    const ciudad = ref('Cancún')
    const latitud = ref(20.97)
    const longitud = ref(-86.93)
    const codigoClima = ref(null)
    const cargando = ref(false)
    const error = ref('')

    /* Datos del clima agrupados con reactive */
    const clima = reactive({
        temperatura: null,
        viento: null,
        codigoClima: null,
        ultimaActualizacion: null
    })


    // Variables computadas
    const tieneClima = computed(() => clima.temperatura !== null)
    const descripcionClima = computed(() => {
        if (!tieneClima.value) return 'Sin datos'
        if (clima.temperatura > 30) return 'Muy hot'
        if (clima.temperatura > 20) return 'Medio hot'
        if (clima.temperatura > 15) return 'Ice'
        return 'Muy ice'
    })

    /* Historial de ciudades visitadas */
    const historial = ref([])

    /* Regresa el icono según el clima de Open-Meteo */
    const iconoClima = computed(() => {
        // Devuelve un emoji representativo o un icono por defecto.
        // Nota: asegurarse de retornar el valor; si no se ve el icono, revisar esta función.
        return tieneClima.value ? interpretarCOdigo(clima.codigoClima).emoji : '🌐'
    })

    /** FC: Tiempo desde la ultima actualización */
    const tiempoActualizacion = computed(() => {
        if (!clima.ultimaActualizacion) return 'Sin datos'
        const minutos = Math.floor((Date.now() - clima.ultimaActualizacion) / 60000)
        if (minutos < 1) return 'Justo ahora'
        if (minutos < 60) return `Hace ${minutos} min.`
        const horas = Math.floor(minutos / 60)
        return `Hace ${horas} hora${horas > 1 ? 's' : ''}.`
    })
    //Acciones
    function setCiudad(nombre, lat, lon) {
        ciudad.value = nombre
        latitud.value = lat
        longitud.value = lon
        //Guardar en historial (si no existe ya)
        if (!historial.value.includes(nombre)) {
            historial.value=[nombre, ...historial.value.slice(0,5)] // Mantener solo las últimas 5 ciudades
        }
    }
    function SetCiudad(nombre, lat, lon) {
        setCiudad(nombre, lat, lon)
    }
    function setClima(temp, vientoKm, cod = null) {
        // Actualiza los datos del clima en el state.
        clima.temperatura = temp
        clima.viento = vientoKm
        clima.codigoClima = cod
        clima.ultimaActualizacion = Date.now()
    }
    function SetClima(temp, vientoKm) {
        setClima(temp, vientoKm)
    }
    function limpiarError() {
        error.value = ''
    }
    function setError(mensaje) {
        error.value = mensaje
    }
    
   //Exponer todo lo que los componentes puedan necesitar
    return {
        ciudad, latitud, longitud,
        clima, historial, cargando, error,
        tieneClima, descripcionClima, iconoClima, tiempoActualizacion,
        setCiudad, setClima, SetClima, limpiarError, setError
    }
}) 
