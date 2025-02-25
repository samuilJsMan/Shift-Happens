import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

import 'vuetify/styles' // eslint-disable-line /* @ts-ignore /*
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'

const app = createApp(App)
const vuetify = createVuetify({components,directives,})

app.use(createPinia())
app.use(vuetify)
app.mount('#app');
