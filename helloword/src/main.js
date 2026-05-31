import { createApp } from 'vue'
import {createPinia} from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

//Importar vistas
import HomeView from './views/HomeView.vue'

//Configurar rutas
const router = createRouter({
    history: createWebHistory(),
    routes:[
        { path: '/', component: HomeView },
        // Agrega más rutas aquí
    ]
})

//Montar aplicaciones y dependencias
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')