import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { addIcons, OhVueIcon } from "oh-vue-icons";
import { IoArrowForwardSharp } from "oh-vue-icons/icons";

addIcons(IoArrowForwardSharp);

createApp(App)
    .use(router)
    .use(Toast)
    .component("v-icon", OhVueIcon)
    .mount("#app");
