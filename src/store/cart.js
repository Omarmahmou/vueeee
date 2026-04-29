import vue from "vue";

const PROMO_CODES = {
  MEGA1000: {
    type: "percent",
    value: 10,
    minOrder: 1000,
    maxOrder: null,
    label: "10% off orders $1000+",
  },
  FLAT200: {
    type: "fixed",
    value: 50,
    minOrder: 200,
    maxOrder: null,
    label: "$50 off orders $200+",
  },
  VIP600: {
    type: "percent",
    value: 32.7,
    minOrder: 600,
    maxOrder: null,
    label: "32.7% off orders above $600",
  },
  SMALL50: {
    type: "percent",
    value: 1,
    minOrder: 0,
    maxOrder: 50,
    label: "1% off orders up to $50",
  },
  FLASH30: {
    type: "percent",
    value: 5,
    minOrder: 30,
    maxOrder: null,
    label: "5% Flash Deal on orders $30+",
  },
};

export const cartState = vue.observable({
  items: JSON.parse(localStorage.getItem("cart_items") || "[]"),

  isOpen: false,
  couponInput: "",
  discountApplied: false,
  activePromo: null,
  couponMessage: "",
  couponMsgType: "",
});

function persist() {
  localStorage.setItem("cart_items", JSON.stringify(cartState.items));
}

function showMessage(msg, type) {
  cartState.couponMessage = msg;
  cartState.couponMsgType = type;
  setTimeout(() => {
    if (cartState.couponMsgType === type) cartState.couponMessage = "";
  }, 4000);
}

function validateActivePromo() {
  if (!cartState.discountApplied || !cartState.activePromo) return;
  const promo = cartState.activePromo;
  const total = cartGetters.subtotal;
  if (promo.minOrder !== null && total < promo.minOrder) {
    cartMethods.removeCoupon();
    showMessage(
      `Coupon removed — cart is now below the $${promo.minOrder} minimum.`,
      "error",
    );
    return;
  }
  if (promo.maxOrder !== null && total > promo.maxOrder) {
    cartMethods.removeCoupon();
    showMessage(
      `Coupon removed — cart exceeded the $${promo.maxOrder} limit.`,
      "error",
    );
  }
}

export const cartMethods = {
  open() {
    cartState.isOpen = true;
  },
  close() {
    cartState.isOpen = false;
  },
  addToCart(product) {
    const existing = cartState.items.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartState.items.push({ ...product, quantity: 1 });
    }
  },
  increaseQty(product) {
    const item = cartState.items.find((i) => i.id === product.id);
    if (item) {
      item.quantity += 1;
      persist();
      validateActivePromo();
    }
  },
  decreaseQty(product) {
    const item = cartState.items.find((i) => i.id === product.id);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      persist();
      validateActivePromo();
    }
  },
  removeFromCart(product) {
    cartState.items = cartState.items.filter((i) => i.id !== product.id);
    persist();
    validateActivePromo();
  },
  clearCart() {
    cartState.items = [];
    cartMethods.removeCoupon();
    persist();
  },
  // promo
  applyCoupon() {
    const code = cartState.couponInput.trim().toUpperCase();
    if (!code) {
      showMessage("Please enter a coupon code.", "error");
      return;
    }
    const promo = PROMO_CODES[code];
    if (!promo) {
      showMessage("Invalid coupon code. Please try again.", "error");
      return;
    }
    const total = cartGetters.subtotal;
    if (promo.minOrder !== null && total < promo.minOrder) {
      showMessage(
        `This code needs a minimum order of $${
          promo.minOrder
        }. Your cart is $${total.toFixed(2)}.`,
        "error",
      );
      return;
    }
    if (promo.maxOrder !== null && total > promo.maxOrder) {
      showMessage(
        `This code is valid only for orders up to $${
          promo.maxOrder
        }. Your cart is $${total.toFixed(2)}.`,
        "error",
      );
      return;
    }
    cartState.activePromo = promo;
    cartState.discountApplied = true;
    showMessage(`${code} applied! ${promo.label}`, "success");
  },

  removeCoupon() {
    cartState.discountApplied = false;
    cartState.activePromo = null;
    cartState.couponInput = "";
    showMessage("Coupon removed.", "info");
  },
};

export const cartGetters = {
  get totalItems() {
    return cartState.items.reduce((sum, i) => sum + i.quantity, 0);
  },
  get subtotal() {
    return cartState.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  get discountAmount() {
    if (!cartState.discountApplied || !cartState.activePromo) return 0;
    const promo = cartState.activePromo;
    if (promo.type === "percent")
      return cartGetters.subtotal * (promo.value / 100);
    if (promo.type === "fixed")
      return Math.min(promo.value, cartGetters.subtotal);
    return 0;
  },
  get itemDiscountRate() {
    if (!cartState.discountApplied || !cartState.activePromo) return 0;
    const promo = cartState.activePromo;
    if (promo.type === "percent") return promo.value / 100;
    if (promo.type === "fixed")
      return cartGetters.discountAmount / cartGetters.subtotal;
    return 0;
  },
  get discountLabel() {
    if (!cartState.activePromo) return "";
    return cartState.activePromo.type === "percent"
      ? `${cartState.activePromo.value}%`
      : `$${cartState.activePromo.value} flat`;
  },
  get finalTotal() {
    return Math.max(0, cartGetters.subtotal - cartGetters.discountAmount);
  },
};
