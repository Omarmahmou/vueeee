<template>
  <div>
    <button @click="$router.push('/products')">← Back</button>

    <ProductDetail v-if="product" :product="product" />
  </div>
</template>

<script>
import axios from "axios";
import ProductDetail from "../components/ProductDetail.vue";

export default {
  components: { ProductDetail },
  data() {
    return {
      product: null,
    };
  },
  methods: {
    async fetchProduct() {
      this.loading = true;
      try {
        const res = await axios.get(
          `https://api.escuelajs.co/api/v1/products/${this.$route.params.id}`,
        );
        this.product = res.data;
      } catch (e) {
        this.error = "Failed to load product";
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchProduct();
  },
};
</script>
