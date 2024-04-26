<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="$emit('click')"></v-app-bar-nav-icon>
    </template>
    <v-spacer />
    <ClientOnly>
      <!-- <Clock class="d-none d-sm-block" /> -->
    </ClientOnly>
    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts" setup>
defineEmits(["click"]);
</script>
