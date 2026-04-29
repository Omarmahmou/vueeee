<template>
  <div class="auth-wrapper">
    <form class="auth-card" @submit.prevent="handleRegister">
      <h2 class="auth-title">Create a new account</h2>

      <div v-if="errorMsg" class="auth-error">{{ errorMsg }}</div>

      <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" placeholder=" name here" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="example@email.com" />
      </div>

      <div class="form-group">
        <label>password</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>

      <div class="form-group">
        <label> confirm password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <button class="auth-btn" type="submit" :disabled="loading">
        {{ loading ? " ..." : " create account" }}
      </button>

      <p class="auth-switch">
        Do you already have an account?
        <router-link to="/login">Login </router-link>
      </p>
    </form>
  </div>
</template>
<script>
import { authMethods } from "../store/auth";

export default {
  name: "RegisterView",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMsg: "",
      successMsg: "",
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.errorMsg = "";
      this.successMsg = "";

      if (
        !this.name ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.errorMsg = "Please enter all the data";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMsg = "The password does not match!";
        return;
      }

      if (this.password.length < 6) {
        this.errorMsg = "The password must be at least 6 characters long.";
        return;
      }

      this.loading = true;
      try {
        authMethods.register(this.name, this.email, this.password);

        // this.$router.push("/products");
        this.$router.push("/products").catch(() => {});
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
  direction: ltr;
}

.auth-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1a1a2e;
}

.auth-subtitle {
  color: #888;
  margin: 0 0 28px;
  font-size: 14px;
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
  margin-bottom: 16px;
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
