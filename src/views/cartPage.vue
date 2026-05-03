<template>
  <div class="cart-page">
    <div class="cart-page-header">
      <button class="back-btn" @click="$router.back()">back</button>
      <h1 class="cart-page-title">cart page</h1>
    </div>
    <!-- when cart is empty -->
    <div class="cart-page-empty" v-if="cartState.items.length === 0">
      <div class="empty-icon">🛒</div>
      <p>your cart is empty</p>
      <button class="shop-now-btn" @click="$router.push('/products')">
        shopping Now
      </button>
    </div>

    <div class="cart-page-body" v-else>
      <!-- cart items -->
      <div class="cart-page-items">
        <transition-group name="item-slide">
          <div
            class="cart-page-item"
            v-for="item in cartState.items"
            :key="item.id"
          >
            <div class="cp-img-wrap">
              <img :src="getImage(item)" :alt="item.title" class="cp-img" />
            </div>
            <div class="cp-info">
              <p class="cp-title">{{ item.title }}</p>
              <p class="cp-unit-price">${{ item.price }} each</p>
            </div>
            <div class="cp-controls">
              <button class="cp-qty-btn" @click="cartMethods.decreaseQty(item)">
                −
              </button>
              <span class="cp-qty">{{ item.quantity }}</span>
              <button class="cp-qty-btn" @click="cartMethods.increaseQty(item)">
                +
              </button>
            </div>
            <div class="cp-subtotal">
              <span
                class="cp-price-original"
                :class="{ discounted: cartState.discountApplied }"
              >
                ${{ (item.price * item.quantity).toFixed(2) }}
              </span>
              <span class="cp-price-after" v-if="cartState.discountApplied">
                ${{
                  (
                    item.price *
                    item.quantity *
                    (1 - cartGetters.itemDiscountRate)
                  ).toFixed(2)
                }}
              </span>
            </div>
            <button class="cp-remove" @click="cartMethods.removeFromCart(item)">
              🗑
            </button>
          </div>
        </transition-group>
      </div>
      <!-- summary -->
      <div class="cart-page-summary">
        <h2 class="summary-title">Request Summary</h2>

        <div class="summary-line">
          <span> items</span>
          <span>{{ cartGetters.totalItems }}</span>
        </div>
        <div class="summary-line">
          <span>Total</span>
          <span>${{ cartGetters.subtotal.toFixed(2) }}</span>
        </div>
        <div
          class="summary-line discount-line"
          v-if="cartState.discountApplied"
        >
          <span>Discount ({{ cartGetters.discountLabel }})</span>
          <span>-${{ cartGetters.discountAmount.toFixed(2) }}</span>
        </div>
        <div class="summary-line total">
          <span>Total after Discount</span>
          <span>${{ cartGetters.finalTotal.toFixed(2) }}</span>
        </div>

        <div class="promo-section">
          <div class="promo-input-wrap">
            <input
              v-model="cartState.couponInput"
              class="promo-input"
              type="text"
              placeholder=" Enter coupon code "
              :disabled="cartState.discountApplied"
              @keyup.enter="cartMethods.applyCoupon()"
            />
            <button
              class="promo-btn"
              @click="
                cartState.discountApplied
                  ? cartMethods.removeCoupon()
                  : cartMethods.applyCoupon()
              "
              :class="{ applied: cartState.discountApplied }"
            >
              {{ cartState.discountApplied ? "Remove" : "Apply" }}
            </button>
          </div>
          <transition name="msg-fade">
            <p
              v-if="cartState.couponMessage"
              class="coupon-msg"
              :class="cartState.couponMsgType"
            >
              {{ cartState.couponMessage }}
            </p>
          </transition>
        </div>

        <button @click="handleCheckout" class="checkout-btn">
          Proceed To Checkout
        </button>
        <button class="clear-all-btn" @click="cartMethods.clearCart()">
          clear cart
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { authMethods } from "@/store/auth";
import { cartState, cartMethods, cartGetters } from "@/store/cart";

export default {
  name: "CartPage",
  data() {
    return { cartState, cartMethods, cartGetters };
  },
  methods: {
    getImage(item) {
      try {
        const url = item.images[0];
        const parsed = JSON.parse(url);
        return Array.isArray(parsed) ? parsed[0] : url;
      } catch {
        return item.images[0];
      }
    },
    handleCheckout() {
      if (authMethods.isLoggedIn()) {
        alert("Order placed successfully!");
      } else {
        this.$router.push({ path: "/login", query: { redirect: "/cart" } });
      }
    },
  },
};
</script>
<style scoped>
.cart-page {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 24px;
  font-family: "DM Sans", sans-serif;
}

.cart-page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}
.back-btn {
  background: #02426a;
  width: 100px;
  color: white;
  padding: 10px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  padding: 11px;
  border: none;
}

.cart-page-title {
  font-family: "Syne", sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

/*  */

.cart-page-empty {
  text-align: center;
  padding: 80px 40px;
}
.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.cart-page-empty h2 {
  font-family: "Syne", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #111;
  margin: 0 0 8px;
}
.cart-page-empty p {
  font-size: 30px;
  margin: 0 0 24px;
}
.shop-now-btn {
  background: #02426a;
  color: white;
  cursor: pointer;
  text-decoration: none;
  border-radius: 10px;
  font-size: 15px;
  padding: 15px;
  border: none;
}

/* cart page body */
.cart-page-body {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}
.cart-page-items {
  flex: 2;
}
.cart-page-summary {
  flex: 1;
}
/* cart page items */
.cart-page-items {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
}
.cart-page-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 10px solid #f0f0f0;
  transition: background 0.2s;
}

.cp-img-wrap {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}
.cp-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cp-info {
  flex: 1;
  min-width: 0;
}
.cp-title {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cp-unit-price {
  font-size: 12px;
  color: #aaa;
  margin: 0;
}

.cp-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f4f4f4;
  border-radius: 10px;
  padding: 6px 10px;
}
.cp-qty-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cp-qty-btn:hover {
  background: #e8e8e8;
  color: #111;
}
.cp-qty {
  font-family: "Syne", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #111;
  min-width: 24px;
  text-align: center;
}

.cp-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px;
}
.cp-price-original {
  font-family: "Syne", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #111;
  transition: all 0.3s;
}
.cp-price-original.discounted {
  text-decoration: line-through;
  color: #bbb;
  font-size: 13px;
}
.cp-price-after {
  font-family: "Syne", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #1a9e8e;
}

.cp-remove {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  opacity: 0.35;
  transition: all 0.2s;
}
.cp-remove:hover {
  background: rgba(255, 80, 80, 0.12);
  opacity: 1;
}

/* cart-page-suummary */
.cart-page-summary {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #ebebeb;
  padding: 24px;
  position: sticky;
  top: 80px;
}
.summary-title {
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #111;
  margin: 0 0 20px;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #777;
  margin-bottom: 12px;
}
.discount-line {
  color: #1a9e8e;
  font-weight: 600;
}
.summary-line.total {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  padding-top: 12px;
  border-top: 1px solid #ebebeb;
  margin-top: 4px;
}

/* Promo في الـ cartPage */
.promo-section {
  margin: 16px 0;
}
.promo-input-wrap {
  display: flex;
  gap: 8px;
}
.promo-input {
  flex: 1;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}
.promo-input:focus {
  border-color: #1a9e8e;
}
.promo-input:disabled {
  background: #f7f7f7;
  color: #aaa;
}
.promo-btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1.5px solid #c8d8d6;
  background: #f0f8f7;
  color: #1a9e8e;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.promo-btn:hover {
  background: #1a9e8e;
  color: #fff;
  border-color: #1a9e8e;
}
.promo-btn.applied {
  background: #fff0f0;
  border-color: #f5c5c5;
  color: #e05555;
}
.promo-btn.applied:hover {
  background: #e05555;
  color: #fff;
  border-color: #e05555;
}
.coupon-msg {
  font-size: 12px;
  margin: 6px 0 0;
  padding: 6px 10px;
  border-radius: 7px;
}
.coupon-msg.success {
  background: #edfaf7;
  color: #1a9e8e;
}
.coupon-msg.error {
  background: #fff0f0;
  color: #e05555;
}
.coupon-msg.info {
  background: #f5f5f5;
  color: #999;
}

.checkout-btn {
  width: 100%;
  background: #111;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, transform 0.15s;
}
.checkout-btn:hover {
  background: #1a9e8e;
  transform: translateY(-1px);
}
.clear-all-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #aaa;
  padding: 11px;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s;
}
.clear-all-btn:hover {
  border-color: #f5a5a5;
  color: #e05555;
  background: #fff5f5;
}

.item-slide-enter-active,
.item-slide-leave-active {
  transition: all 0.3s ease;
}
.item-slide-enter,
.item-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.msg-fade-enter-active,
.msg-fade-leave-active {
  transition: all 0.25s ease;
}
.msg-fade-enter,
.msg-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
