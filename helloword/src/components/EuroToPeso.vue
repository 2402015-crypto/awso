<script setup>
import { ref, onMounted } from "vue"
import { obtenerTipoCambio } from "@/services/exchangeService"

const tipoCambio = ref(null)
const cantidadEuros = ref(0)
const resultado = ref(null)
const error = ref("")

async function cargarTipoCambio() {
    error.value = ""
    try {
        tipoCambio.value = await obtenerTipoCambio()
    } catch (err) {
        error.value = err.message
    }
}

function convertir() {
    if (!tipoCambio.value) {
        error.value = "No se pudo obtener el tipo de cambio"
        return
    }
    resultado.value = (cantidadEuros.value * tipoCambio.value).toFixed(2)
}

onMounted(cargarTipoCambio)
</script>

<template>
    <div class="exchange-card">
        <h2>Tipo de cambio EUR → MXN</h2>
        <p v-if="tipoCambio">El tipo de cambio es de ${{ tipoCambio }} MXN</p>
        <p v-else-if="error">⚠️ {{ error }}</p>
        <p v-else>Cargando tipo de cambio...</p>


        <div class="form">
            <input type="number" v-model="cantidadEuros" placeholder="Cantidad en euros" />
            <button @click="convertir">Convertir</button>
        </div>

        <div v-if="resultado" class="resultado">
            <p>{{ cantidadEuros }} € = ${{ resultado }} MXN</p>
        </div>
    </div>
</template>

<style scoped>
.exchange-card {
    border: 2px solid #2563eb;
    border-radius: 12px;
    padding: 20px;
    max-width: 400px;
    font-family: Arial, sans-serif;
}

.error {
    color: #991b1b;
    margin: 8px 0;
}

.form {
    margin-top: 12px;
    display: flex;
    gap: 8px;
}

input {
    flex: 1;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

button {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
}
</style>
