import { defineStore } from 'pinia'
import { ref, computed } from "vue"

export const useWeatherStore = defineStore('weather', () => {
    //Estados
    const ciudad = ref('Cancún')
    const latitud = ref(20.97)
    const longitud = ref(-86.93)
    const temperatura = ref(null)
    const viento = ref(null)
    const codigoClima = ref(null)
    const cargando = ref(false)
    const error = ref('')

    //Variables computadas
    const tieneClima = computed(() => temperatura.value !== null)
    const descripcionClima = computed(() => {
        if (!tieneClima.value) return 'Sin datos'
        if (temperatura.value > 30) return 'Muy hot'
        if (temperatura.value > 20) return 'Medio hot'
        if (temperatura.value > 15) return 'Ice'
        return 'Muy ice'
    })
    
    //Acciones
    function setCiudad(nombre, lat, lon) {
        ciudad.value = nombre
        latitud.value = lat
        longitud.value = lon
    }
    function SetCiudad(nombre, lat, lon) {
        setCiudad(nombre, lat, lon)
    }
    function setClima(temp, vientoKm) {
        temperatura.value = temp
        viento.value = vientoKm
    }
    function SetClima(temp, vientoKm) {
        setClima(temp, vientoKm)
    }
    function limpiarError() {
        error.value = ''
    }
    
   //Exponer todo lo que los componentes puedan necesitar
    return {
        ciudad, latitud, longitud,
        temperatura, viento, codigoClima, cargando, error,
        tieneClima, descripcionClima,
        setCiudad, setClima, SetCiudad, SetClima, limpiarError
    }
}) 
