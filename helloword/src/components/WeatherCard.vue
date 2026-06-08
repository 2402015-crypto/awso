<script setup>
/*
  Componente: WeatherCard
  Descripción: Muestra la tarjeta de clima usando el `weatherStore`.
  - Lee datos desde el store: `ciudad`, `clima`, `cargando`, `error`.
  - Proporciona la acción `cargarClima()` para forzar la actualización.
  Notas:
  - Este componente usa Composition API (`<script setup>`).
  - Muchas referencias se obtienen desde `useWeatherStore()` y desde
    los servicios en `src/services/weatherService.js`.
  - Hay marcadores TODO en el código (p. ej. nombres de variables
    inconsistentes) que deben revisarse si el comportamiento es incorrecto.
*/
import { watch, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerClima } from '../services/weatherService'

const store = useWeatherStore();
let timerId = null;

// Acción pública: solicita al servicio los datos del clima y actualiza el store.
async function cargarClima() {
  store.cargando = true;
  // limpiar errores previos en el store
  store.limpiarError();
  try {
    // Llamada al servicio externo que retorna { temperatura, viento, codigoClima }
    const data = await obtenerClima(store.latitud, store.longitud)
    // Actualizar el store con los datos recibidos
    store.setClima(data.temperatura, data.viento, data.codigoClima)
  } catch {
    // En caso de error, registrar un mensaje de error en el store
    store.setError('No se pudo obtener el clima. Intenta nuevamente.')
  } finally {
    store.cargando = false;
  }
}

/*Watch: recargar cuando el usuario cambie de ubicación
  Solo se ejecutará cuando latitud o longitud cambien*/

// Vigila cambios en latitud/longitud para recargar el clima automáticamente.
watch([
  () => store.latitud,
  () => store.longitud
], () => cargarClima())

onMounted(() => {
  // Al montar, cargar el clima inicialmente.
  cargarClima()
  // Recargar periódicamente (cada 5 minutos)
  timerId = setInterval(cargarClima, 5 * 60 * 1000)
})

onUnmounted(() => {
  // Limpiar el intervalo cuando el componente se desmonte
  clearInterval(timerId)
})

</script>
<template>
  <div class="card">
    <header>
      <div>
        <h2>{{ store.ciudad }}</h2>
        <span class="actualizacion">{{ store.tiempoActualizacion }}</span>
      </div>
      <span class="badge">{{ store.descripcionClima }}</span>
    </header>

    <div v-if="store.cargando" class="estado">
      <span class="spinner">⌛</span>Obteniendo clima...
    </div>
    <div v-else-if="store.error" class="error">
      {{ store.error }}
    </div>
    <div v-else class="datos">
      <p class="icono">{{ store.iconoClima }}</p>
      <p class="viento">{{ store.clima.viento }} km/h</p>
      <p class="temp">{{ store.clima.temperatura }}°C</p>
    </div>

    <!--Historial-->
    <div class="historial" v-if="store.historial.length > 0">
      <p class="historial-ciudad">Recientes:</p>
      <span class="chip" v-for="ciudad in store.historial" :key="ciudad">
        {{ ciudad }}
      </span>
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