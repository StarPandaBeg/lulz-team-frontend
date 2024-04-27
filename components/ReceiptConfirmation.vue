<script setup lang="ts">
import moment from "moment";
import type { QrParseResult } from "~/types/parser";
import type { Receipt } from "~/types/receipt";
import type { Transaction } from "~/types/transaction";

const emits = defineEmits(["save"]);
const opened = defineModel<boolean>();
const props = defineProps<{
  transaction: Transaction;
  receipt: Receipt;
  qr: QrParseResult;
}>();

const close = () => {
  opened.value = false;
};
const save = () => {
  emits("save");
};
</script>

<template>
  <v-dialog v-model="opened" :max-width="800">
    <v-card
      title="Данные не совпадают. Продолжить?"
      subtitle="Вы действительно хотите загрузить этот чек? Данные в чеке и в выписке не совпадают!"
    >
      <template #text>
        <VTable>
          <thead>
            <tr>
              <td>Поле</td>
              <td>Ожидалось</td>
              <td>В чеке</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Дата авторизации</td>
              <td>{{ props.transaction.authorization_date }}</td>
              <td>{{ moment(props.qr.t).format("YYYY-MM-DD") }}</td>
            </tr>
            <tr>
              <td>Сумма</td>
              <td>{{ props.transaction.amount_in_account_currency }}</td>
              <td>{{ props.qr.s }}</td>
            </tr>
          </tbody>
        </VTable>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          text="Отмена"
          @click="close"
        />
        <v-btn color="primary" variant="elevated" @click="save">
          Продолжить
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
