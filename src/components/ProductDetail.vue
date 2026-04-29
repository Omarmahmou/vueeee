<template>
  <div class="product-detail">
    <div class="detail-container">
      <div class="images-section">
        <img :src="selectedImage" class="main-image" />
        <div class="thumbnails">
          <img
            v-for="(img, index) in product.images"
            :key="index"
            :src="img"
            :class="['thumb', { active: selectedImage === img }]"
            @click="selectedImage = img"
          />
        </div>
      </div>

      <div class="info-section">
        <h1>{{ product.title }}</h1>
        <p class="price">${{ product.price }}</p>
        <p class="description">{{ product.description }}</p>

        <div class="actions">
          <button class="add-cart-btn" @click="$emit('add-to-cart', product)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductDetail",
  props: {
    product: Object,
  },
  data() {
    return {
      selectedImage: this.product.images[0],
    };
  },
};
</script>

<style scoped>
.product-detail {
  padding: 30px 40px;
}

.back-btn {
  background: none;
  border: 2px solid #333;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  margin-bottom: 30px;
  transition: all 0.2s;
}
.back-btn:hover {
  background: #333;
  color: white;
}

.detail-container {
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
}

.images-section {
  flex: 1;
  min-width: 280px;
}

.main-image {
  width: 100%;
  max-width: 420px;
  height: 350px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.thumb.active,
.thumb:hover {
  border-color: #4f46e5;
}

.info-section {
  flex: 1;
  min-width: 280px;
}

.category {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

h1 {
  font-size: 28px;
  margin: 14px 0 10px;
  color: #1a1a2e;
}

.price {
  font-size: 26px;
  font-weight: 700;
  margin: 8px 0 16px;
}

.description {
  color: #555;
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 28px;
}

.actions {
  display: flex;
  gap: 14px;
}

.add-cart-btn {
  background: #0ca1ac;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.add-cart-btn:hover {
  background: #0468b4;
}
</style>
