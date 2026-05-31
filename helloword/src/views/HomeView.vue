<script setup>
import { onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerClima, obtenerCoordenadasCiudad } from '@/services/weatherService'

const store = useWeatherStore()

async function cargarClima() {
  store.cargando = true
  store.limpiarError()

  try {
    const datos = await obtenerClima(store.latitud, store.longitud)
    store.setClima(datos.temperatura, datos.viento)
    store.codigoClima = datos.codigoClima
  } catch {
    store.error = 'No se pudo conectar con la API de clima'
  } finally {
    store.cargando = false
  }
}

async function onBuscar(ciudad) {
  store.limpiarError()

  try {
    const datosCiudad = await obtenerCoordenadasCiudad(ciudad)
    store.setCiudad(datosCiudad.nombre, datosCiudad.latitud, datosCiudad.longitud)
    await cargarClima()
  } catch (error) {
    store.error = error?.message || 'No se pudo encontrar la ciudad'
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
