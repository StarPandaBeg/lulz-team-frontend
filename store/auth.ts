import { defineStore } from "pinia";

type State = {
  user_id: number;
};

export const useAuthStore = defineStore("auth", {
  state: () =>
    <State>{
      user_id: -1,
    },
  actions: {
    setUser(user_id: number) {
      const cookie = useCookie("user_id");
      this.user_id = user_id;

      cookie.value = user_id == -1 ? null : user_id.toString();
    },
  },
});
