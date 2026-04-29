<template>
  <div id="app">
    <nav class="navbar" v-if="isProductsPage">
      <SearchProducts v-model="search" />
      <div class="nav-right">
        <span class="user-greeting" v-if="currentUser"
          >Hello {{ currentUser.name }}
        </span>
        <button class="logout-btn" @click="handleLogout">Exit</button>
        <button class="cart-icon-btn" @click="cartMethods.open()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            />
          </svg>
          <span class="cart-badge" v-if="cartGetters.totalItems > 0">{{
            cartGetters.totalItems
          }}</span>
        </button>
      </div>
    </nav>

    <CartSidebar
      :isOpen="cartState.isOpen"
      :cart="cartState.items"
      @close="cartMethods.close()"
      @remove="cartMethods.removeFromCart($event)"
      @increase="cartMethods.increaseQty($event)"
      @decrease="cartMethods.decreaseQty($event)"
      @clear="cartMethods.clearCart()"
    />

    <div class="page-content">
      <template v-if="isProductsPage">
        <p v-if="loading">Loading products...</p>
        <p v-if="error">{{ error }}</p>
        <ProductsApp
          :products="filteredProducts"
          @view-detail="$router.push('/products/' + $event.id)"
          @add-to-cart="cartMethods.addToCart($event)"
        />
      </template>
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SearchProducts from "./components/searchProducts.vue";
import ProductsApp from "./components/productsApp.vue";
import CartSidebar from "./components/CartSidebar.vue";
import { authState, authMethods } from "./store/auth";
import { cartState, cartMethods, cartGetters } from "./store/cart";

export default {
  name: "App",
  components: { SearchProducts, ProductsApp, CartSidebar },
  data() {
    return {
      search: "",
      products: [],
      loading: false,
      error: null,
      cartState,
      cartMethods,
      cartGetters,
    };
  },
  computed: {
    isProductsPage() {
      return this.$route.path === "/products";
    },
    currentUser() {
      return authState.user;
    },
    filteredProducts() {
      return this.products.filter((p) =>
        p.title.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
  },
  methods: {
    handleLogout() {
      authMethods.logout();
      this.$router.push("/login");
    },
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("https://api.escuelajs.co/api/v1/products");
        this.products = res.data;
      } catch (e) {
        this.error = "Failed to load products";
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style>
body {
  background: #f5f5f7;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 900;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  background: white;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-greeting {
  font-size: 14px;
  font-weight: 500;
  color: #444;
  direction: rtl;
}

.logout-btn {
  background: #fff0f0;
  color: #c62828;
  border: 1.5px solid #ffcdd2;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #ffcdd2;
}

.cart-icon-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: #e02020;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
</style>
