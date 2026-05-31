<script setup>
import WeatherCard from '../components/WeatherCard.vue'
</script>
<template>
<section class="home">
  <h1>Weather App</h1>
  <p class="subtitle">Aplicación del clima en tiempo real</p>
    <WeatherCard />
  </section>    
</template>
<style scoped>
.home {
  padding: 40px;
  font-family: 'Arial';
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
