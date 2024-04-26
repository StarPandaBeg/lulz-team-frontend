<script lang="ts" setup>
import moment from "moment";
import { useTitledPageStore } from "~/store/titled";
import type { PaginatedResult } from "~/types/common/result";
import type { Transaction } from "~/types/transaction";
import type { Trip } from "~/types/trip";
import operationTypes from "~/util/operationTypes";
import transactionStatuses from "~/util/transactionStatuses";

definePageMeta({
  layout: "titled",
});
useHead({
  title: "Просмотр записи",
});

const templateStore = useTitledPageStore();
const { $api } = useNuxtApp();
const route = useRoute();

const id = parseInt(route.params.id as string);
const data = ref<Trip>(await $api.trips.getById(id));
const transactions = ref<PaginatedResult<Transaction>>(
  await $api.transactions.get(id, { page: 1, perPage: 10 })
);
const nonConfirmed = ref<number>(await $api.trips.nonConfirmed(id));

const updateTable = async (options: { page: number; itemsPerPage: number }) => {
  transactions.value = await $api.transactions.get(id, {
    page: options.page,
    perPage: options.itemsPerPage,
  });
};

onMounted(() => {
  templateStore.setTitle("Просмотр записи");
  templateStore.clearActions();

  templateStore.addAction({
    props: {
      color: "primary",
      variant: "outlined",
      to: "/",
    },
    text: "Назад",
  });
  templateStore.addAction({
    props: {
      color: "primary",
      variant: "outlined",
    },
    text: "Отчет",
  });
});

const headers = [
  {
    key: "account_number",
    title: "Расчётный счёт",
  },
  {
    key: "operation_type",
    title: "Тип операции",
  },
  {
    key: "authorization_date",
    title: "Транзакция",
  },
  {
    key: "amount_in_account_currency",
    title: "Сумма",
  },
  {
    key: "confirmation_status",
    title: "Статус",
  },
  {
    key: "actions",
    title: "Действия",
    align: "end",
  },
];
</script>

<template>
  <div class="d-flex flex-column ga-2">
    <VAlert density="compact" type="warning" variant="outlined" closable>
      Есть неподтвержденные записи
      <template #append>
        <VBtn variant="text">Подтвердить</VBtn>
      </template>
    </VAlert>
    <VTable>
      <tbody>
        <tr>
          <td>Командированный</td>
          <td>{{ data.fio }}</td>
        </tr>
        <tr>
          <td>Дата командировки</td>
          <td>
            {{ moment(data.date_start).format("DD.MM.YYYY") }} -
            {{ moment(data.date_end).format("DD.MM.YYYY") }}
          </td>
        </tr>
        <tr>
          <td>Итого записей</td>
          <td>
            {{ transactions.total }} (из них не подтверждено:
            {{ nonConfirmed }})
          </td>
        </tr>
      </tbody>
    </VTable>
    <VDataTableServer
      :headers="headers"
      :items="transactions.data"
      :items-length="transactions.total"
      hover
      @update:options="updateTable"
    >
      <template #item.authorization_date="{ item }">
        {{ moment(item.authorization_date).format("DD.MM.YYYY") }}
      </template>
      <template #item.confirmation_status="{ item }">
        <!-- @vue-expect-error -->
        <VChip v-bind="transactionStatuses[item.confirmation_status]"></VChip>
      </template>
      <template #item.operation_type="{ item }">
        {{ operationTypes[item.operation_type] }}
      </template>
      <template #item.actions="{ item }">
        <v-btn
          :to="`/manage/${id}/edit/${item.id}`"
          class="mx-1"
          color="primary"
          variant="text"
          min-width="36px"
          width="36px"
          title="Редактировать"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </VDataTableServer>
  </div>
</template>