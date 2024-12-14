import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import store from '@/store'

// pages
import LoginView from '../views/LoginView.vue'
import ListView from '@/views/ListView.vue'
import ProfileView from "@/views/ProfileView.vue";

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
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      title: "Profile"
    },
    component: ProfileView,
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
      store.dispatch("setUser", JSON.parse(user));
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
