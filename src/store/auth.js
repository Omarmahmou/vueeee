import vue from "vue";

export const authState = vue.observable({
  user: JSON.parse(localStorage.getItem("auth_user") || "null"),
});

export const authMethods = {
  register(name, email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("This email already exists!");
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const safeUser = { id: newUser.id, name, email };
    authState.user = safeUser;
    localStorage.setItem("auth_user", JSON.stringify(safeUser));
  },
  login(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      throw new Error("The email or password is wrong!");
    }
    const safeUser = { id: user.id, name: user.name, email: user.email };
    authState.user = safeUser;
    localStorage.setItem("auth_user", JSON.stringify(safeUser));
  },
  logout() {
    authState.user = null;
    localStorage.removeItem("auth_user");
  },
  isLoggedIn() {
    return authState.user !== null;
  },
};
