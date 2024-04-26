<template>
  <v-app class="bg-grey-lighten-5">
    <TheAppBar @click="navShown = !navShown" />
    <TheNavigationDrawer v-if="navShown" />
    <v-main>
      <v-container fluid class="px-10">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const navShown = ref(true);
</script>
