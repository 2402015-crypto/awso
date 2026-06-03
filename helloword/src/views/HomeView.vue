<script setup>
// Vista: HomeView
// Descripción: pantalla principal que combina el `SearchBar` y la `WeatherCard`.
// - Usa el `weatherStore` para obtener y actualizar la ubicación y el clima.
// - Maneja la búsqueda de ciudades y la carga inicial de datos.
import { onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerClima, obtenerCoordenadasCiudad } from '@/services/weatherService'

const store = useWeatherStore()

// Carga el clima actual y actualiza el store.
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

// Manejador del evento `buscar` emitido por SearchBar
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
