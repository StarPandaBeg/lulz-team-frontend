<script setup lang="ts">
import type { Receipt } from "~/types/receipt";
import type { Transaction } from "~/types/transaction";

const emits = defineEmits(["save"]);
const opened = defineModel<boolean>();
const props = defineProps<{
  transaction: Transaction;
  receipt: Receipt;
}>();

const { $api } = useNuxtApp();
const currencies = ref(await $api.currencies.list());

const close = () => {
  opened.value = false;
};
const save = () => {
  emits("save");
  opened.value = false;
};
</script>

<template>
  <v-dialog v-model="opened" :max-width="1200">
    <v-card
      title="Подтвердить запись?"
      subtitle="Внимательно проверьте введенные данные"
    >
      <template #text>
        <VRow>
          <VCol>
            <VCard
              variant="outlined"
              color="grey-darken-3"
              subtitle="Основная информация"
            >
              <template #text>
                <p>
                  Идентификатор транзакции:
                  <b>{{ props.transaction.transaction_id }}</b>
                </p>
                <p>
                  Тип операции:
                  <b>{{ props.transaction.operation_type }}</b>
                </p>
                <p>
                  Категория операции:
                  <b>{{ props.transaction.operation_category }}</b>
                </p>
                <p>
                  Статус:
                  <b>{{ props.transaction.status }}</b>
                </p>
                <p>
                  Дата создания:
                  <b>
                    {{
                      props.transaction.creation_date
                        ? props.transaction.creation_date
                        : "-"
                    }}
                  </b>
                </p>
                <p>
                  Дата авторизации:
                  <b>{{ props.transaction.authorization_date }}</b>
                </p>
                <p>
                  Дата транзакции:
                  <b>{{ props.transaction.transaction_date }}</b>
                </p>
                <p>
                  ID оригинальной операции:
                  <b>{{
                    props.transaction.original_operation_id
                      ? props.transaction.original_operation_id
                      : "-"
                  }}</b>
                </p>
                <p>
                  Сумма в валюте операции:
                  <b>{{
                    props.transaction.operation_amount_in_currency
                      ? props.transaction.operation_amount_in_currency
                      : "-"
                  }}</b>
                </p>
                <p>
                  Валюта:
                  <b>
                    {{ props.transaction.operation_currency }}
                    ({{
                      currencies.find(
                        (c) => c.id == props.transaction.operation_currency
                      )?.code
                    }})
                  </b>
                </p>
              </template>
            </VCard>
          </VCol>
          <VCol>
            <VCard variant="outlined" color="grey-darken-3" subtitle="Платёж">
              <template #text>
                <p>
                  Назначение:
                  <b>{{ props.transaction.payment_purpose }}</b>
                </p>
                <p>
                  Номер:
                  <b>
                    {{
                      props.transaction.payment_number
                        ? props.transaction.payment_number
                        : "-"
                    }}
                  </b>
                </p>
                <p>
                  Очередность:
                  <b>
                    {{
                      props.transaction.sequence
                        ? props.transaction.sequence
                        : "-"
                    }}
                  </b>
                </p>
                <p>
                  Код (УИН):
                  <b>
                    {{ props.transaction.code ? props.transaction.code : "-" }}
                  </b>
                </p>
                <p>
                  Номер карты:
                  <b>{{ props.transaction.card_number }}</b>
                </p>
                <p>
                  MCC:
                  <b>{{ props.transaction.mcc }}</b>
                </p>
                <p>
                  Город:
                  <b>{{ props.transaction.place_of_transaction_city }}</b>
                </p>
                <p>
                  Код страны:
                  <b>{{ props.transaction.place_of_transaction_country }}</b>
                </p>
              </template>
            </VCard>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VCard
              variant="outlined"
              color="grey-darken-3"
              subtitle="Контрагент"
            >
              <template #text>
                <p>
                  Контрагент:
                  <b>{{ props.transaction.counterparty }}</b>
                </p>
                <p>
                  ИНН:
                  <b>{{ props.transaction.counterparty_inn }}</b>
                </p>
                <p>
                  КПП:
                  <b>{{ props.transaction.counterparty_kpp }}</b>
                </p>
                <p>
                  Счёт:
                  <b>{{ props.transaction.counterparty_account }}</b>
                </p>
                <p>
                  БИК банка:
                  <b>{{ props.transaction.counterparty_bank_bik }}</b>
                </p>
                <p>
                  Корр. счёт банка:
                  <b>{{ props.transaction.counterparty_bank_corr_account }}</b>
                </p>
                <p>
                  Название банка:
                  <b>{{
                    props.transaction.counterparty_bank_name
                      ? props.transaction.counterparty_bank_name
                      : "-"
                  }}</b>
                </p>
              </template>
            </VCard>
          </VCol>
          <VCol>
            <VCard variant="outlined" color="grey-darken-3" subtitle="Чек">
              <template #text>
                <p>
                  Фискальный номер:
                  <b>{{ props.receipt.fn }}</b>
                </p>
                <p>
                  Фискальный документ:
                  <b>{{ props.receipt.fd }}</b>
                </p>
                <p>
                  Фискальный признак:
                  <b>{{ props.receipt.fp }}</b>
                </p>
                <p>
                  Адрес организации:
                  <b>{{
                    props.transaction.organization_address
                      ? props.transaction.organization_address
                      : "-"
                  }}</b>
                </p>
                <p>
                  Банк:
                  <b>{{
                    props.transaction.bank ? props.transaction.bank : "-"
                  }}</b>
                </p>
              </template>
            </VCard>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VCard
              variant="outlined"
              color="grey-darken-3"
              subtitle="Налоговая информация"
            >
              <template #text>
                <p>
                  Статус составителя расчетного документа:
                  <b>{{ props.transaction.document_creator_status }}</b>
                </p>
                <p>
                  КБК-код бюджетной классификации:
                  <b>{{ props.transaction.budget_classification_code }}</b>
                </p>
                <p>
                  Код ОКТМО:
                  <b>{{ props.transaction.oktmo_code }}</b>
                </p>
                <p>
                  Основание налогового платежа:
                  <b>{{ props.transaction.tax_payment_basis }}</b>
                </p>
                <p>
                  Налоговый период/Код таможенного органа:
                  <b>{{ props.transaction.tax_period_customs_code }}</b>
                </p>
                <p>
                  Номер налогового документа:
                  <b>{{ props.transaction.tax_document_number }}</b>
                </p>
                <p>
                  Дата налогового документа:
                  <b>{{
                    props.transaction.tax_document_date
                      ? props.transaction.tax_document_date
                      : "-"
                  }}</b>
                </p>
                <p>
                  Тип налогового платежа:
                  <b>{{ props.transaction.tax_payment_type }}</b>
                </p>
              </template>
            </VCard>
          </VCol>
        </VRow>
      </template>
      <template #actions>
        <VSpacer />
        <v-btn
          color="primary"
          variant="outlined"
          text="Закрыть"
          @click="close"
        />
        <v-btn
          color="primary"
          variant="elevated"
          text="Сохранить"
          @click="save"
        />
      </template>
    </v-card>
  </v-dialog>
</template>
