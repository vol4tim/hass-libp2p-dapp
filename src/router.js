import { createRouter, createWebHashHistory } from "vue-router";
import Libp2p from "./views/Libp2p.vue";

const routes = [
  {
    path: "/",
    name: "Libp2p",
    component: Libp2p,
    meta: {
      title: "Libp2p"
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
