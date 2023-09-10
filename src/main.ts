import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/main.css';
import 'highlight.js/styles/a11y-dark.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
