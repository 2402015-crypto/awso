<script setup>
import { ref, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import HistorialCiudades from '../components/HistorialCiudades.vue'
import EuroToPeso from '../components/EuroToPeso.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerClima, obtenerCoordenadasCiudad } from '@/services/weatherService'

const store = useWeatherStore()
const vistaActual = ref('clima')

async function cargarClima() {
  store.cargando = true
  store.limpiarErrores()
  try {
    const datos = await obtenerClima(store.latitud, store.longitud)
    store.setClima(datos.temperatura, datos.viento, datos.codigoClima)
  } catch (error) {
    store.setError(error.message)
  } finally {
    store.cargando = false
  }
}

async function onBuscar(ciudad) {
  store.limpiarErrores()
  try {
    const datosCiudad = await obtenerCoordenadasCiudad(ciudad)
    store.setCiudad(datosCiudad.nombre, datosCiudad.latitud, datosCiudad.longitud)
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

    <!-- Botones para cambiar vista -->
    <div class="switcher">
      <button class="btn" @click="vistaActual = 'clima'">Ver Clima</button>
      <button class="btn" @click="vistaActual = 'divisa'">Convertidor EUR → MXN</button>
    </div>


    <!-- Bloque de errores -->
    <div v-if="store.errores.length > 0" class="alerta">
      <p v-for="(err, i) in store.errores" :key="i">⚠️ {{ err }}</p>
      <button @click="store.limpiarErrores()">Cerrar</button>
    </div>

    <!-- Mostrar según la vista -->
    <div v-if="vistaActual === 'clima'">
      <SearchBar @buscar="onBuscar" />
      <WeatherCard :cargarClima="cargarClima" />
      <HistorialCiudades />
    </div>

    <div v-else-if="vistaActual === 'divisa'">
      <EuroToPeso />
    </div>
  </section>
</template>

<style scoped>
.switcher {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover {
  background: #1e40af;
  /* tono más oscuro al pasar el mouse */
}

.home {
  padding: 40px;
  font-family: Arial, sans-serif;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
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
