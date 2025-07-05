import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createI18n} from 'vue-i18n'
import I18n from './i18n/i18n'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'

const app = createApp(App)
const vuetify = createVuetify({components,directives,})
const i18n=createI18n(I18n)

app.use(createPinia())
app.use(vuetify)
app.use(i18n)
app.mount('#app');
