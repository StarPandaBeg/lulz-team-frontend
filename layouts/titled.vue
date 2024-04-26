<template>
  <v-app class="bg-grey-lighten-5">
    <TheAppBar @click="navShown = !navShown" />
    <TheNavigationDrawer v-if="navShown" />
    <v-main>
      <v-container fluid class="px-10">
        <v-row class="mb-4">
          <v-col cols="8">
            <h1>
              {{ store.title }}
            </h1>
          </v-col>
          <v-col cols="4" class="d-flex justify-end align-end">
            <v-btn
              v-for="(action, index) in store.actions ?? []"
              :key="index"
              class="mx-2"
              v-bind="action.props ?? {}"
              v-on="action.events ?? {}"
            >
              {{ action.text }}
            </v-btn>
          </v-col>
        </v-row>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useTitledPageStore } from "~/store/titled";

const store = useTitledPageStore();
const navShown = ref(true);
</script>
