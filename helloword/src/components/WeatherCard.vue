<script setup>
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { interpretarCOdigo } from '@/services/weatherService'

defineProps({
  cargarClima: {
    type: Function,
    required: true
  }
})

const store = useWeatherStore()
const clima = computed(() => interpretarCOdigo(store.codigoClima))
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h2 {
  color: #6ba0e4;
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