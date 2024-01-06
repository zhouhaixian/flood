import { createApp } from "vue";
import router from "./router";
import axios from "axios";

import App from "./App.vue";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
createApp(App).use(router).mount("#app");
