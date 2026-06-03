<script setup>
// Componente: SearchBar
// Descripción: formulario simple que emite el evento `buscar` con el nombre de la ciudad.
// Uso: <SearchBar @buscar="onBuscar" />
import { ref } from 'vue'

const emit = defineEmits(['buscar'])
const ciudadInput = ref('')

function buscar() {
  // Normalizar y validar la entrada antes de emitir
  const ciudad = ciudadInput.value.trim()

  if (!ciudad) return

  emit('buscar', ciudad)
}
</script>

<template>
  <form class="search-bar" @submit.prevent="buscar">
    <input
      v-model="ciudadInput"
      type="text"
      placeholder="Escribe una ciudad"
      aria-label="Ciudad"
    />
    <button type="submit">Buscar</button>
  </form>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  margin: 24px 0 28px;
  flex-wrap: wrap;
}

input {
  flex: 1;
  min-width: 220px;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
}

button {
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}
</style>