import {
    createMemoryHistory,
    createRouter,
    createWebHistory,
} from "vue-router";
import JoinView from "./views/JoinView.vue";
import LobbyView from "./views/LobbyView.vue";

const routes = [
    { path: "/", component: JoinView },
    { path: "/lobby", component: LobbyView },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
