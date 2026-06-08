import { defineStore } from 'pinia'
import { ref, computed, reactive } from "vue"
import { interpretarCOdigo } from "@/services/weatherService"

export const useWeatherStore = defineStore('weather', () => {
    // Estados
    const ciudad = ref('Cancún')
    const latitud = ref(20.97)
    const longitud = ref(-86.93)
    const cargando = ref(false)
    const error = ref('')

    const clima = reactive({
        temperatura: null,
        viento: null,
        codigoClima: null,
        ultimaActualizacion: null
    })

    // Historial de ciudades [{ nombre, lat, lon }]
    const historial = ref([])

    // Computadas
    const tieneClima = computed(() => clima.temperatura !== null)
    const descripcionClima = computed(() => {
        if (!tieneClima.value) return 'Sin datos'
        if (clima.temperatura > 30) return 'Muy hot'
        if (clima.temperatura > 20) return 'Medio hot'
        if (clima.temperatura > 15) return 'Ice'
        return 'Muy ice'
    })

    const iconoClima = computed(() =>
        tieneClima.value ? interpretarCOdigo(clima.codigoClima).emoji : '🌐'
    )

    const tiempoActualizacion = computed(() => {
        if (!clima.ultimaActualizacion) return 'Sin datos'
        const minutos = Math.floor((Date.now() - clima.ultimaActualizacion) / 60000)
        if (minutos < 1) return 'Justo ahora'
        if (minutos < 60) return `Hace ${minutos} min.`
        const horas = Math.floor(minutos / 60)
        return `Hace ${horas} hora${horas > 1 ? 's' : ''}.`
    })

    // Acciones
    function setCiudad(nombre, lat, lon) {
        ciudad.value = nombre
        latitud.value = lat
        longitud.value = lon

        // Guardar solo el nombre en historial
        const existe = historial.value.find(c => c === nombre)

        if (!existe) {
            historial.value = [nombre, ...historial.value].slice(0, 5)
        }
    }


    function setClima(temp, vientoKm, cod = null) {
        clima.temperatura = temp
        clima.viento = vientoKm
        clima.codigoClima = cod
        clima.ultimaActualizacion = Date.now()
    }

    function limpiarError() {
        error.value = ''
    }

    function setError(mensaje) {
        error.value = mensaje
    }

    function limpiarHistorial() {
        historial.value = []
    }

    return {
        ciudad, latitud, longitud,
        clima, historial, cargando, error,
        tieneClima, descripcionClima, iconoClima, tiempoActualizacion,
        setCiudad, setClima, limpiarError, setError, limpiarHistorial
    }
})
