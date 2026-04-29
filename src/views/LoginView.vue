<template>
  <div class="auth-wrapper">
    <form class="auth-card" @submit.prevent="handleLogin">
      <p>Log in</p>
      <div v-if="errorMsg" class="auth-error">{{ errorMsg }}</div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" placeholder="example@gmail.com" type="email" />
      </div>
      <div class="form-group">
        <label>password</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>
      <button class="auth-btn" type="submit" :disabled="loading">
        {{ loading ? "Logging in..." : " Login" }}
      </button>
      <p class="auth-switch">
        Don't you have an account?
        <router-link to="/register">Create an account</router-link>
      </p>
    </form>
  </div>
</template>
<script>
import { authMethods } from "@/store/auth";

export default {
  data() {
    return {
      errorMsg: "",
      email: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.errorMsg = "";
      if (!this.email || !this.password) {
        this.errorMsg = "Please enter your email and password";
        return;
      }
      this.loading = true;
      try {
        authMethods.login(this.email, this.password);
        const redirect = this.$route.query.redirect || "/products";
        // this.$router.push(redirect);
        this.$router.push(redirect).catch(() => {});
      } catch (e) {
        this.errorMsg = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
}

.auth-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
}

.auth-error {
  background: #fff0f0;
  border: 1px solid #ffcdd2;
  color: #c62828;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
  text-align: left;
  direction: ltr;
}

.form-group input:focus {
  border-color: #0ca1ac;
}

.auth-btn {
  width: 100%;
  background: #0ca1ac;
  color: white;
  border: none;
  padding: 13px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.2s;
}

.auth-btn:hover:not(:disabled) {
  background: #0468b4;
}

.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.auth-switch a {
  color: #0ca1ac;
  font-weight: 600;
  text-decoration: none;
}
</style>
