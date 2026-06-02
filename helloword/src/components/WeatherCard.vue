<script setup>
import { watch, onMounted, onUnmounted  } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import {obtenerClima} from '../services/weatherService'

const store = useWeatherStore();
let timerId = null;

async function cargarClima() {
 store.cargando = true;
 store.LimpiarError();
 try {
  const data = await obtenerClima(store.latitud, store.longitud)
  store.setClima(datos.temperatura, datos.viento, datos.codigoClima)
} catch {
  store.Error('No se pudo obtener el clima. Intenta nuevamente.')
} finally {
  store.cargando = false;
 }
}

/*Watch: recargar cuando el usuario cambie de ubicación
  Solo se ejecutará cuando latitud o longitud cambien*/

watch(
  [() => store.latitud, () => store.longitud], 
  () =>
  cargarClima())

onMounted(() => {
  await cargarClima()
  // Recargar cada 10 minutos
  timer= setInterval(cargarClima, 5 * 60 * 1000); //cada 5 minutos
})

onUnmounted(() => {
    clearInterval(timer) // Limpiar el timer al desmontar el componente
  })

</script>
<template>
  <div class="card">
    <header>
      <h2>{{ store.ciudad }}</h2>
      <span class="badge">{{ clima.desc }}</span>
    </header>

    <div v-if="store.error" class="estado error">
      {{ store.error }}
    </div>

    <div v-else class="datos">
      <p class="temp">{{ store.temperatura }}°C</p>
      <p class="viento">{{ store.viento }} km/h</p>
      <p class="estado">{{ clima.emoji }} {{ clima.desc }}</p>
    </div>

    <button @click="cargarClima" :disabled="store.cargando">
      {{ store.cargando ? 'Actualizando...' : 'Actualizar' }}
    </button>
  </div>
</template>

<style scoped>
.card {
  border: 2px solid #2563eb;
  border-radius: 16px;
  padding: 28px;
  max-width: 340px;
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  text-align: center;
}

h2 {
  color: #6ba0e4;
  font-size: 24px;
  margin: 0;
}

.badge {
  background: #dbeafe;
  color: #1e3a5f;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.temp {
  font-size: 48px;
  font-weight: 800;
  color: #2563eb;
  margin: 16px 0 0;
}

.viento {
  color: #5e7394;
  margin: 4px 0;
}

.estado {
  padding: 20px 0;
  color: #a1a5a9;
}

.error {
  color: #991b1b;
}

button {
  margin-top: 16px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>