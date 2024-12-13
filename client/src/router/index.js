import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ListView from '@/views/ListView.vue'
import store from '@/store'
import { nextTick } from 'vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ListView
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login"
    },
    component: LoginView,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || "LibreX";
  });
});

router.beforeEach((to, from, next) => {
  if (!store.state?.user?.user.id) {
    const user = localStorage.getItem("user");
    if (user) {
      // store.dispatch("setUser", JSON.parse(user));
    } else {
      // go to login page if user is not logged in
      console.log(to.name);
      if (to.name !== "login") {
        window.alert("Você precisa estar logado para acessar esta página!");
        next({ name: "login" });
        return;
      }
    }
  }

  next();
});

export default router
