<template>
  <div class="card" @click="$emit('view-detail', product)">
    <img :src="product.images[0]" class="card-img" />
    <div class="about">
      <span class="card-category" v-if="product.category">{{
        product.category.name
      }}</span>
      <h2>{{ product.title }}</h2>
      <p class="card-price">${{ product.price }}</p>
    </div>
    <button class="cart-btn" @click.stop="$emit('add-to-cart', product)">
      Add to cart
    </button>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
  },
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.about {
  padding: 14px 16px 8px;
  flex: 1;
}
.card-category {
  font-size: 12px;

  font-weight: 600;
  text-transform: uppercase;
}

.card-price {
  font-size: 18px;
  font-weight: 700;

  margin: 4px 0;
}
.cart-btn {
  margin: 10px 16px 16px;
  background: #0ca1ac;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.cart-btn:hover {
  background: #0468b4;
}
</style>
