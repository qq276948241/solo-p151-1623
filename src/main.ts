import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import vTooltip from './directives/tooltip'

const app = createApp(App)
const pinia = createPinia()

app.directive('tooltip', vTooltip)
app.use(pinia)
app.use(router)
app.mount('#app')
