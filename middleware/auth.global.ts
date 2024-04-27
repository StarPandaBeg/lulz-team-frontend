import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  const id = useCookie("user_id");

  if (to.fullPath.includes("api")) {
    return;
  }

  if (to.fullPath == "/login") {
    if (id.value != undefined) {
      return navigateTo("/");
    }
    return;
  }

  if (id.value == undefined) {
    auth.setUser(-1);
    return navigateTo("/login");
  }

  auth.setUser(parseInt(id.value));
});
