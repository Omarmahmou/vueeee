<template>
  <transition name="sidebar-slide">
    <div class="cart-overlay" v-if="isOpen" @click.self="$emit('close')">
      <div class="cart-sidebar">
        <div class="cart-header">
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>

        <div class="cart-empty" v-if="cart.length === 0">
          <p class="cart-empty-title">Your cart is empty</p>
          <p class="empty-sub">Add some products to get started</p>
        </div>

        <div class="cart-items" v-else>
          <transition-group name="item-fade">
            <div class="cart-item" v-for="item in cart" :key="item.id">
              <div class="item-img-wrap">
                <img :src="getImage(item)" :alt="item.title" class="item-img" />
              </div>
              <div class="item-info">
                <p class="item-name">{{ item.title }}</p>
                <div class="item-price-wrap">
                  <p
                    class="item-price"
                    :class="{ discounted: cartState.discountApplied }"
                  >
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                  <p class="item-price-after" v-if="cartState.discountApplied">
                    ${{
                      (
                        item.price *
                        item.quantity *
                        (1 - cartGetters.itemDiscountRate)
                      ).toFixed(2)
                    }}
                  </p>
                </div>
                <p class="item-unit">${{ item.price }} each</p>
              </div>
              <div class="item-controls">
                <button class="qty-btn" @click="$emit('decrease', item)">
                  -
                </button>
                <span class="qty-num">{{ item.quantity }}</span>
                <button class="qty-btn" @click="$emit('increase', item)">
                  +
                </button>
              </div>
              <button class="remove-btn" @click="$emit('remove', item)">
                🗑
              </button>
            </div>
          </transition-group>
        </div>

        <div class="cart-footer" v-if="cart.length > 0">
          <div class="summary">
            <div class="summary-row">
              <span>Items</span><span>{{ cartGetters.totalItems }}</span>
            </div>
            <div
              class="summary-row discount-row"
              v-if="cartState.discountApplied"
            >
              <span>Discount ({{ cartGetters.discountLabel }})</span>
              <span class="discount-amount"
                >-${{ cartGetters.discountAmount.toFixed(2) }}</span
              >
            </div>
            <div class="summary-row total-row">
              <span>Subtotal</span>
              <span class="total-price"
                >${{ cartGetters.subtotal.toFixed(2) }}</span
              >
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <span class="total-price"
                >${{ cartGetters.finalTotal.toFixed(2) }}</span
              >
            </div>
          </div>

          <!-- Promo -->
          <div class="promo-section">
            <div class="promo-input-wrap">
              <input
                v-model="cartState.couponInput"
                class="promo-input"
                type="text"
                placeholder="Enter Coupon Code"
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

          <router-link
            to="/cart"
            class="go-to-cart-btn"
            @click.native="$emit('close')"
          >
            go to shopping cart
          </router-link>

          <button class="clear-btn" @click="$emit('clear')">Clear Cart</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { cartState, cartMethods, cartGetters } from "@/store/cart";

export default {
  name: "CartSidebar",
  props: {
    isOpen: { type: Boolean },
    cart: { type: Array },
  },
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
  },
};
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}
.cart-sidebar {
  width: 400px;
  max-width: 95vw;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: "DM Sans", sans-serif;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
  border-left: 1px solid #e0e0e0;
}
.cart-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 28px 24px 20px;
  border-bottom: 1px solid #ebebeb;
}
.close-btn {
  background: #f4f4f4;
  border: none;
  color: #888;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover {
  background: #ebebeb;
  color: #333;
}
.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px;
}
.cart-empty-title {
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0;
}
.empty-sub {
  font-size: 14px;
  color: #aaa;
  margin: 0;
}
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}
.cart-items::-webkit-scrollbar {
  width: 4px;
}
.cart-items::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}
.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fafafa;
  border: 1px solid #efefef;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.cart-item:hover {
  background: #f4f4f4;
}
.item-img-wrap {
  width: 58px;
  height: 58px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #ebebeb;
}
.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-info {
  flex: 1;
  min-width: 0;
}
.item-name {
  font-size: 13px;
  font-weight: 500;
  color: #222;
  margin: 0 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-price-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.item-price {
  font-family: "Syne", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin: 0 0 2px;
  transition: all 0.3s;
}
.item-price.discounted {
  text-decoration: line-through;
  color: #bbb;
  font-size: 13px;
}
.item-price-after {
  font-family: "Syne", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1a9e8e;
  margin: 0 0 2px;
}
.item-unit {
  font-size: 11px;
  color: #aaa;
  margin: 0;
}
.item-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 4px;
}
.qty-btn {
  background: none;
  border: none;
  color: #888;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.qty-btn:hover {
  background: #e8e8e8;
  color: #333;
}
.qty-num {
  font-family: "Syne", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #111;
  min-width: 20px;
  text-align: center;
}
.remove-btn {
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s;
  opacity: 0.4;
  flex-shrink: 0;
}
.remove-btn:hover {
  background: rgba(255, 80, 80, 0.15);
  opacity: 1;
}
.cart-footer {
  padding: 0 20px 24px;
  border-top: 1px solid #ebebeb;
}
.summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-top: 16px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
}
.discount-row {
  color: #1a9e8e;
}
.discount-amount {
  font-weight: 700;
}
.total-row {
  font-size: 16px;
  color: #111;
  font-weight: 500;
  padding-top: 8px;
  border-top: 1px solid #ebebeb;
}
.total-price {
  font-family: "Syne", sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #111;
}
.promo-section {
  margin-bottom: 12px;
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

.go-to-cart-btn {
  background: #02426a;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  padding: 11px;
}

.clear-btn {
  width: 100%;
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #999;
  padding: 11px;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover {
  border-color: #f5a5a5;
  color: #e05555;
  background: #fff5f5;
}
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: opacity 0.3s ease;
}
.sidebar-slide-enter-active .cart-sidebar,
.sidebar-slide-leave-active .cart-sidebar {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-slide-enter .cart-sidebar,
.sidebar-slide-leave-to .cart-sidebar {
  transform: translateX(100%);
}
.sidebar-slide-enter,
.sidebar-slide-leave-to {
  opacity: 0;
}
.item-fade-enter-active,
.item-fade-leave-active {
  transition: all 0.25s ease;
}
.item-fade-enter,
.item-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
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
