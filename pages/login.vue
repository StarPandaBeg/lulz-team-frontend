<script lang="ts" setup>
import { useToast } from "vue-toastification";
import { useAuthStore } from "~/store/auth";

definePageMeta({
  layout: "empty",
});
useHead({
  title: "Авторизация",
});

const { $api } = useNuxtApp();
const login = ref("");
const password = ref("");
const authStore = useAuthStore();
const toast = useToast();

const auth = async () => {
  try {
    const user_id = await $api.auth.auth(login.value, password.value);
    authStore.setUser(user_id);
    location.reload();
    toast.success("Добро пожаловать!");
  } catch (e) {
    console.log(e);

    toast.error("Неправильный логин / пароль");
  }
  // if (login.value == "kostya.shmurakov@mail.ru" && password.value == "123123") {
  //   authStore.setSuccess(true);
  //   await navigateTo("/");
  // } else {
  //   toast.error("Неправильный логин / пароль");
  // }
};
</script>

<template>
  <v-layout full-height class="d-flex justify-center align-center">
    <v-card class="px-2 py-6" min-width="500">
      <template #title>
        <h1 class="text-h5 font-weight-bold text-primary">Добро пожаловать!</h1>
      </template>
      <template #subtitle>
        <h2 class="text-h6 text-grey-darken-3">Войдите в свой аккаунт</h2>
      </template>
      <template #text>
        <v-form class="mt-3">
          <v-text-field
            variant="outlined"
            placeholder="Электронная почта"
            v-model="login"
          />
          <v-text-field
            variant="outlined"
            placeholder="Пароль"
            type="password"
            hide-details
            v-model="password"
          />
          <v-btn
            class="mt-6"
            variant="elevated"
            color="primary"
            block
            @click="auth()"
          >
            Войти
          </v-btn>
        </v-form>
      </template>
    </v-card>
  </v-layout>
</template>
