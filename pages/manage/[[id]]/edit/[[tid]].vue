<script lang="ts" setup>
import moment from "moment";
import { useToast } from "vue-toastification";
import { useBulkStore } from "~/store/bulk";
import { useTitledPageStore } from "~/store/titled";
import type { QrParseResult } from "~/types/parser";
import type { Receipt } from "~/types/receipt";
import type { Transaction } from "~/types/transaction";
import type { Trip } from "~/types/trip";
import { operationCategoriesArray } from "~/util/operationCategories";
import { operationTypesArray } from "~/util/operationTypes";
import { normalizeDate } from "~/util/util";

definePageMeta({
  layout: "titled",
});
useHead({
  title: "Подтверждение записи",
});

const templateStore = useTitledPageStore();
const bulk = useBulkStore();
const toast = useToast();
const { $api } = useNuxtApp();
const route = useRoute();

const id = parseInt(route.params.id as string);
const tid = parseInt(route.params.tid as string);
const viewedFile = ref<File>();

const getReceipt = async (id: number) => {
  try {
    return await $api.receipts.get(id);
  } catch {
    return <Receipt>{
      id,
      fd: null,
      fp: null,
      fn: null,
    };
  }
};
const parseReceipt = async (file: File) => {
  viewedFile.value = file;
  try {
    loading.value = true;

    try {
      const gptResult = await $api.parser.gpt(file);
      transaction.value.counterparty = gptResult.organisation_name;
      transaction.value.organization_address = gptResult.address;
      transaction.value.card_number = gptResult.card_number;
    } catch (e) {}

    const result = await $api.parser.qr(file);
    const date = moment(result.t).format("YYYY-MM-DD");
    if (
      result.s != transaction.value.amount_in_account_currency ||
      date != transaction.value.authorization_date
    ) {
      qr.value = result;
      receiptConfirmationOpened.value = true;
      loading.value = false;
      return;
    }
    fillReceipt(result);

    toast.success("Данные автоматически заполнены!");
    tab.value = "receipt";
  } catch (e) {
    console.log(e);
    toast.error(
      "К сожалению, не удалось обработать файл. Введите данные вручную"
    );
  }
  loading.value = false;
};
const confirmReceipt = () => {
  receiptConfirmationOpened.value = false;
  fillReceipt(qr.value!);
  toast.success("Данные автоматически заполнены!");
  tab.value = "receipt";
};
const fillReceipt = (result: QrParseResult) => {
  Object.assign(receipt.value, result);
  receipt.value.fd = result.i;
  transaction.value.amount_in_account_currency = result.s;
  transaction.value.authorization_date = moment(result.t).format("YYYY-MM-DD");
};

const trip = ref<Trip>(await $api.trips.getById(id));
const transaction = ref<Transaction>(await $api.transactions.getById(tid, id));
const receipt = ref<Receipt>(await getReceipt(tid));
const nextNonConfirmedId = ref<number>(await $api.transactions.next(id, tid));
const currencies = ref(await $api.currencies.list());
const confirmationOpened = ref<boolean>();
const loading = ref<boolean>();

const qr = ref<QrParseResult>();
const receiptConfirmationOpened = ref<boolean>();

const router = useRouter();

type TabValues =
  | "upload"
  | "general"
  | "counterparty"
  | "payment"
  | "receipt"
  | "tax";
const tab = ref<TabValues>();
const panel = ref<Array<number>>([0]);

const tabs = ["upload", "general", "counterparty", "payment", "receipt", "tax"];

const trySave = () => {
  confirmationOpened.value = true;
};

const save = async () => {
  try {
    loading.value = true;

    transaction.value.creation_date = normalizeDate(
      transaction.value.creation_date
    );
    transaction.value.authorization_date = normalizeDate(
      transaction.value.authorization_date
    );
    transaction.value.transaction_date = normalizeDate(
      transaction.value.transaction_date
    );
    transaction.value.tax_document_date = normalizeDate(
      transaction.value.tax_document_date
    );

    await $api.transactions.edit(transaction.value, tid, id);

    if (Object.values(receipt.value).every((v) => v != "" && v != null)) {
      await $api.receipts.edit(receipt.value, tid);
    }

    toast.success("Сохранено!");

    if (bulk.bulk) {
      if (nextNonConfirmedId.value == -1) {
        router.push(`/manage/${id}`);
      } else {
        location.assign(`/manage/${id}/edit/${nextNonConfirmedId.value}`);
        toast.success("Переходим к следующей записи!");
      }
    } else {
      router.push(`/manage/${id}`);
    }
  } catch (e) {
    console.log(e);
    toast.error("При сохранении данных произошла ошибка");
  }
  loading.value = false;
};

const hasPrev = computed(() => tabs.indexOf(tab.value!) > 0);
const isLast = computed(() => tabs.indexOf(tab.value!) == tabs.length - 1);

const prev = () => {
  const index = tabs.indexOf(tab.value!);
  // @ts-expect-error
  tab.value = tabs[index - 1];
};
const next = () => {
  const index = tabs.indexOf(tab.value!);
  // @ts-expect-error
  tab.value = tabs[index + 1];
};

const nextOrSave = async () => {
  if (isLast.value) return trySave();
  next();
};

const receiptUrl = computed(() => {
  if (viewedFile.value == undefined) return null;
  return URL.createObjectURL(viewedFile.value);
});

const tryFillCounterparty = async () => {
  try {
    loading.value = true;
    const result = await $api.counterparties.find(
      transaction.value.counterparty_inn
    );
    Object.assign(transaction.value, result);
    toast.success("Заполнено!");
  } catch {
    toast.warning("Контрагент не найден");
  }
  loading.value = false;
};

onMounted(() => {
  templateStore.setTitle("Подтверждение записи");
  templateStore.clearActions();

  templateStore.addAction({
    props: {
      color: "primary",
      variant: "outlined",
      to: `/manage/${id}`,
    },
    text: "Назад",
  });
  templateStore.addAction({
    props: {
      color: "primary",
    },
    text: "Сохранить",
    events: {
      click: trySave,
    },
  });
});
</script>

<template>
  <VForm>
    <v-expansion-panels v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-title>Информация для поиска</v-expansion-panel-title>
        <v-expansion-panel-text>
          <VTable>
            <tbody>
              <tr>
                <td>Командированный</td>
                <td>{{ trip.fio }}</td>
              </tr>
              <tr>
                <td>Номер счёта</td>
                <td>{{ transaction.account_number }}</td>
              </tr>
              <tr>
                <td>Дата авторизации</td>
                <td>
                  {{
                    moment(transaction.authorization_date).format("DD.MM.YYYY")
                  }}
                </td>
              </tr>
              <tr>
                <td>Сумма</td>
                <td>{{ transaction.amount_in_account_currency }}</td>
              </tr>
            </tbody>
          </VTable>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <VCard class="mt-3" :loading="loading">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="upload">Загрузка чека</v-tab>
        <v-tab value="general">Общая информация</v-tab>
        <v-tab value="counterparty">Контрагент</v-tab>
        <v-tab value="payment">Платёж</v-tab>
        <v-tab value="receipt">Чек</v-tab>
        <v-tab value="tax">Налоговая информация</v-tab>
      </v-tabs>
      <VCardText>
        <VWindow v-model="tab">
          <VWindowItem value="upload">
            <VRow>
              <VCol class="d-flex flex-column align-center ga-4">
                <VImg src="/images/hand.png" :width="128" />
                <Dropzone
                  class="w-100"
                  accept="image/png"
                  @upload="parseReceipt"
                />
                <p class="pt-3 text-medium-emphasis">
                  Вы можете выбрать файл с чеком, чтобы автоматически заполнить
                  некоторые поля
                </p>
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem value="general">
            <VRow class="d-flex align-center pt-1">
              <VCol cols="2">Идентификатор транзакции</VCol>
              <VCol>
                <VTextField
                  v-model="transaction.transaction_id"
                  label="Идентификатор транзакции"
                  variant="outlined"
                  hide-details
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center">
              <VCol cols="2">Тип операции</VCol>
              <VCol cols="4">
                <VSelect
                  v-model="transaction.operation_type"
                  :items="operationTypesArray"
                  item-title="title"
                  item-value="key"
                  label="Тип операции"
                  variant="outlined"
                  hide-details
                />
              </VCol>
              <VCol cols="2">Категория операции</VCol>
              <VCol cols="4">
                <VSelect
                  v-model="transaction.operation_category"
                  :items="operationCategoriesArray"
                  item-title="title"
                  item-value="key"
                  label="Категория операции"
                  variant="outlined"
                  hide-details
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Дата</VCol>
              <VCol cols="3">
                <VTextField
                  v-model="transaction.creation_date"
                  label="Дата создания операции"
                  type="date"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="3">
                <VTextField
                  v-model="transaction.authorization_date"
                  label="Дата авторизации"
                  type="date"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.transaction_date"
                  label="Дата транзакции"
                  type="date"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Идентификатор оригинальной операции</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.original_operation_id"
                  label="Идентификатор оригинальной операции"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Сумма операции в валюте операции</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.operation_amount_in_currency"
                  label="Сумма операции в валюте операции"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Валюта операции</VCol>
              <VCol cols="4">
                <VSelect
                  v-model="transaction.operation_currency"
                  :items="currencies"
                  item-title="code"
                  item-value="id"
                  label="Валюта операции"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Сумма в валюте счета</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.amount_in_account_currency"
                  label="Сумма в валюте счета"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem value="counterparty">
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">ИНН</VCol>
              <VCol>
                <VTextField
                  v-model="transaction.counterparty_inn"
                  label="ИНН"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="1">
                <VBtn color="primary" @click="tryFillCounterparty()">Авто</VBtn>
              </VCol>
            </VRow>
            <VRow class="d-flex align-center">
              <VCol cols="2">Наименование</VCol>
              <VCol>
                <VTextField
                  v-model="transaction.counterparty"
                  label="Наименование"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center">
              <VCol cols="2">КПП</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.counterparty_kpp"
                  label="КПП"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Счёт</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.counterparty_account"
                  label="Счёт"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center">
              <VCol cols="2">БИК банка</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.counterparty_bank_bik"
                  label="БИК"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Корр. счёт</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.counterparty_bank_corr_account"
                  label="Корр. счёт"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center">
              <VCol cols="2">Наименование банка</VCol>
              <VCol>
                <VTextField
                  v-model="transaction.counterparty_bank_name"
                  label="Наименование банка"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem value="payment">
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Назначение платежа</VCol>
              <VCol>
                <VTextarea
                  v-model="transaction.payment_purpose"
                  label="Назначение платежа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Доп. информация</VCol>
              <VCol cols="3">
                <VTextField
                  v-model="transaction.payment_number"
                  label="Номер платежа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.sequence"
                  label="Очерёдность"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="3">
                <VTextField
                  v-model="transaction.code"
                  label="Код (УИК)"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Номер карты</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.card_number"
                  label="Номер карты"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">MCC</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.mcc"
                  label="MCC"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Город</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.place_of_transaction_city"
                  label="Город"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Код страны</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.place_of_transaction_country"
                  label="Код страны"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem value="receipt">
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">ИНН</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.counterparty_inn"
                  label="ИНН"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Фискальный номер (ФН)</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="receipt.fn"
                  label="Фискальный номер"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Фискальный документ (ФД)</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="receipt.fd"
                  label="Фискальный документ"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Фискальный признак (ФП)</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="receipt.fp"
                  label="Фискальный признак"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Назначение платежа</VCol>
              <VCol>
                <VTextarea
                  v-model="transaction.payment_purpose"
                  label="Назначение платежа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Адрес организации</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.organization_address"
                  label="Адрес организации"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Банк</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.bank"
                  label="Банк"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VWindowItem>
          <VWindowItem value="tax">
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Статус составителя расчетного документа</VCol>
              <VCol>
                <VTextField
                  v-model="transaction.document_creator_status"
                  label="Статус составителя расчетного документа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">КБК</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.budget_classification_code"
                  label="КБК-код бюджетной классификации"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">ОКТМО</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.oktmo_code"
                  label="ОКТМО"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Назначение платежа</VCol>
              <VCol>
                <VTextarea
                  v-model="transaction.tax_payment_basis"
                  label="Назначение платежа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Налоговый период/Код таможенного органа</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.tax_period_customs_code"
                  label="Налоговый период/Код таможенного органа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Номер документа</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.tax_document_number"
                  label="Номер документа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VRow class="d-flex align-center pt-2">
              <VCol cols="2">Дата документа</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.tax_document_date"
                  label="Дата документа"
                  type="date"
                  hide-details
                  variant="outlined"
                />
              </VCol>
              <VCol cols="2">Тип платежа</VCol>
              <VCol cols="4">
                <VTextField
                  v-model="transaction.tax_payment_type"
                  label="Тип платежа"
                  hide-details
                  variant="outlined"
                />
              </VCol>
            </VRow>
          </VWindowItem>
        </VWindow>
      </VCardText>
      <VCardActions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          text="Назад"
          :disabled="!hasPrev"
          @click="prev"
        />
        <v-btn color="primary" variant="elevated" @click="nextOrSave">
          {{ isLast ? "Сохранить" : "Далее" }}
        </v-btn>
      </VCardActions>
    </VCard>
    <TransactionConfirmModal
      v-model="confirmationOpened"
      :transaction="transaction"
      :receipt="receipt"
      @save="save"
    />
    <ReceiptConfirmation
      v-model="receiptConfirmationOpened"
      :transaction="transaction"
      :receipt="receipt"
      :qr="qr!"
      @save="confirmReceipt"
    />
    <ReceiptView v-if="receiptUrl != null" :src="receiptUrl!" />
  </VForm>
</template>
