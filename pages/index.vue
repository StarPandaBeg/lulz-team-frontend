<script lang="ts" setup>
import { useTitledPageStore } from "~/store/titled";
import type { PaginatedResult } from "~/types/common/result";
import type { Trip } from "~/types/trip";

definePageMeta({
  layout: "titled",
});
useHead({
  title: "Командировки",
});

const templateStore = useTitledPageStore();
const { $api } = useNuxtApp();

const data = ref<PaginatedResult<Trip>>(
  await $api.trips.get({
    page: 1,
    perPage: 10,
  })
);
const updateTable = async (options: { page: number; itemsPerPage: number }) => {
  data.value = await $api.trips.get({
    page: options.page,
    perPage: options.itemsPerPage,
  });
};

onMounted(() => {
  templateStore.setTitle("Список командированных");
  templateStore.clearActions();
});

const headers = [
  {
    key: "fio",
    title: "ФИО",
  },
  {
    key: "date_start",
    title: "Дата начала",
  },
  {
    key: "date_end",
    title: "Дата окончания",
  },
  {
    key: "status",
    title: "Статус",
  },
  {
    key: "actions",
    title: "Действия",
    sortable: false,
    align: "end",
  },
];
</script>

<template>
  <VDataTableServer
    :headers="headers"
    :items="data.data"
    :items-length="data.total"
    hover
    @update:options="updateTable"
  >
    <template #item.actions="{ item }">
      <v-btn
        :to="`/manage/${item.id}`"
        class="mx-1"
        color="primary"
        variant="text"
        min-width="36px"
        width="36px"
        title="Редактировать"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        class="mx-1"
        color="primary"
        variant="text"
        min-width="36px"
        width="36px"
        title="Сформировать отчёт"
        @click.stop
      >
        <v-icon>mdi-file-document-check</v-icon>
      </v-btn>
    </template>
  </VDataTableServer>
</template>
