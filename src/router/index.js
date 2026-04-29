import Vue from "vue";
import VueRouter from "vue-router";
import ProductPage from "../views/ProductPage.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { authMethods } from "../store/auth";
import cartPage from "@/views/cartPage.vue";
// import { component } from "vue/types/umd";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/products" },

  { path: "/login", component: LoginView, meta: { guest: true } },
  { path: "/register", component: RegisterView, meta: { guest: true } },

  {
    path: "/products",
    // component: { render: () => null },
    component:ProductPage,
    meta: { requiresAuth: true },
  },
  { path: "/cart", component: cartPage, meta: { requiresAuth: true } },
  {
    path: "/products/:id",
    component: ProductPage,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = authMethods.isLoggedIn();

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else if (to.meta.guest && isLoggedIn) {
    next("/products");
  } else {
    next();
  }
});

export default router;
