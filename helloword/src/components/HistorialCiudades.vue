<script setup>
import { useWeatherStore } from '@/stores/weatherStore'
import { obtenerCoordenadasCiudad } from '@/services/weatherService'

const store = useWeatherStore()

const seleccionarCiudad = async (nombre) => {
  try {
    const datosCiudad = await obtenerCoordenadasCiudad(nombre)
    store.setCiudad(datosCiudad.nombre, datosCiudad.latitud, datosCiudad.longitud)
  } catch (error) {
    store.setError(error?.message || 'No se pudo encontrar la ciudad')
  }
}
</script>

<template>
  <div v-show="store.historial.length > 0" class="historial-container">
    <h3>Historial de ciudades</h3>
    <div class="historial-list">
      <button
        v-for="(nombre, index) in [...store.historial].reverse()"
        :key="index"
        @click="seleccionarCiudad(nombre)"
        class="historial-btn"
      >
        {{ nombre }}
      </button>
    </div>
    <button @click="store.limpiarHistorial()" class="limpiar-btn">
      Limpiar historial
    </button>
  </div>
</template>

<style scoped>
.historial-container {
    margin-top: 1rem;
}

.historial-list {
    display: flex;
    flex-direction: column;
    /* vertical */
    gap: 0.5rem;
}

.historial-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    /* transparente */
    border: 1px solid #0060dd;
    /* mismo color que ya usas */
    color: #0060dd;
    /* letras del mismo color */
    cursor: pointer;
    text-align: left;
}

.historial-btn:hover {
    background: rgba(0, 96, 221, 0.1);
    /* leve sombreado al pasar */
}

.limpiar-btn {
    margin-top: 1rem;
    background: #f55;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
}
</style>
