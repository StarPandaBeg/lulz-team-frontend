<script lang="ts" setup>
import moment from "moment";
import { useTitledPageStore } from "~/store/titled";
import type { QrParseResult } from "~/types/parser";
import type { Transaction } from "~/types/transaction";
import operationTypes from "~/util/operationTypes";
import transactionStatuses from "~/util/transactionStatuses";

definePageMeta({
  layout: "titled",
});
useHead({
  title: "Результаты поиска",
});

const templateStore = useTitledPageStore();
const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const id = parseInt(route.params.id as string);

if (Object.keys(route.query).length == 0) {
  navigateTo(`/manage/${id}`);
}

const query = route.query as QrParseResult;
const data = ref<Transaction[]>(await $api.transactions.find(id, query));

onMounted(() => {
  templateStore.setTitle("Результаты поиска");
  templateStore.clearActions();

  templateStore.addAction({
    props: {
      color: "primary",
      variant: "outlined",
      to: `/manage/${id}`,
    },
    text: "Назад",
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
  <VDataTable :headers="headers" :items="data" hover>
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
  </VDataTable>
</template>
