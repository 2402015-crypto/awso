<script setup>
import { onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import HistorialCiudades from '../components/HistorialCiudades.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerClima, obtenerCoordenadasCiudad } from '@/services/weatherService'

const store = useWeatherStore()

// Carga inicial del clima
async function cargarClima() {
  store.cargando = true
  store.limpiarError()
  try {
    const datos = await obtenerClima(store.latitud, store.longitud)
    store.setClima(datos.temperatura, datos.viento, datos.codigoClima)
  } catch {
    store.setError('No se pudo conectar con la API de clima')
  } finally {
    store.cargando = false
  }
}

// Manejador de búsqueda desde SearchBar
async function onBuscar(ciudad) {
  store.limpiarError()
  try {
    const datosCiudad = await obtenerCoordenadasCiudad(ciudad)
    store.setCiudad(datosCiudad.nombre, datosCiudad.latitud, datosCiudad.longitud)
    await cargarClima()
  } catch (error) {
    store.setError(error?.message || 'No se pudo encontrar la ciudad')
  }
}

onMounted(cargarClima)
</script>

<template>
  <section class="home">
    <h1>Weather App</h1>
    <p class="subtitle">Aplicación del clima en tiempo real</p>
    <SearchBar @buscar="onBuscar" />
    <WeatherCard :cargarClima="cargarClima" />
    <!-- Nuevo componente de historial -->
    <HistorialCiudades />
  </section>
</template>

<style scoped>
.home {
  padding: 40px;
  font-family: Arial, sans-serif;
  max-width: 720px;
  margin: 0 auto;
}
.subtitle {
  color: #667488;
}
h1 {
  color: #0060dd;
  font-size: 2rem;
  margin-bottom: 8px;
}
</style>
