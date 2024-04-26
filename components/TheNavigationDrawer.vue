<template>
  <v-navigation-drawer
    v-model="opened"
    :expand-on-hover="mdAndUp"
    :rail="mdAndUp"
    theme="dark"
    order="-1"
  >
    <v-list>
      <!-- <v-list-item
        prepend-avatar="/images/stpnd.jpg"
        title="Константин Шмураков"
        subtitle="kostya.shmurakov@mail.ru"
      /> -->
    </v-list>
    <v-divider />
    <v-list nav>
      <!-- <v-list-item
        prepend-icon="mdi-domain"
        title="Компании"
        link
        to="/companies"
      />
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Клиенты"
        link
        to="/clients"
      />
      <v-list-item
        prepend-icon="mdi-file-document"
        title="Договора"
        link
        to="/agreements"
      /> -->
    </v-list>

    <template #append>
      <v-list> </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();
const opened = ref(mdAndUp.value);
const toast = useToast();
</script>
