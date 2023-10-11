import { Buffer } from "buffer";
import { robonomicsUI } from "robonomics-ui-vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "robonomics-ui-vue/style.css";

window.Buffer = Buffer;

const app = createApp(App);

app.use(router).use(store).use(robonomicsUI, { store }).mount("#app");
