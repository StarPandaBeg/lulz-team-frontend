<script setup lang="ts">
import moment from "moment";

const opened = defineModel<boolean>();

type FileData = {
  f: File;
  url: string;
  status: string;
  color: string;
};

const { $api } = useNuxtApp();
const files = ref<FileData[]>([]);
const props = defineProps<{
  id: number;
}>();

const upload = (file: File) => {
  files.value.push({
    f: file,
    url: URL.createObjectURL(file),
    status: "не обработан",
    color: "gray",
  });
};

const close = () => {
  opened.value = false;
};
const run = () => {
  const toProcess = files.value.filter((f) => f.status == "не обработан");

  toProcess.forEach(async (data) => {
    try {
      const parsed = await $api.parser.qr(data.f);
      data.status = "Распознан. Поиск записи";

      const records = await $api.transactions.find(props.id, parsed);
      if (records.length == 0) {
        data.status = "Записей не найдено!";
        data.color = "orange";
        return;
      }
      if (records.length > 1) {
        data.status = "Конфликт";
        data.color = "orange";
        return;
      }

      const transaction = records[0];
      transaction.amount_in_account_currency = parsed.s;
      transaction.authorization_date = moment(parsed.t).format("YYYY-MM-DD");
      await $api.transactions.edit(transaction, transaction.id, props.id);

      const receipt = await $api.receipts.get(transaction.id);
      Object.assign(receipt, parsed);
      receipt.fd = parsed.i;
      await $api.receipts.edit(receipt, receipt.id);

      data.status = "ОК";
      data.color = "green";
    } catch (e) {
      data.status = "Ошибка";
      data.color = "red";
    }
  });

  // emits("save");
};

watch(opened, () => {
  files.value.length = 0;
});
</script>

<template>
  <v-dialog v-model="opened" :max-width="800">
    <v-card title="Автоматический поиск и загрузка данных">
      <template #text>
        <Dropzone accept="image/png" @upload="upload" />
        <VTable class="mt-4" v-if="files.length > 0">
          <thead>
            <tr>
              <th></th>
              <th>Наименование</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, i) in files" :key="i">
              <td><VImg :src="file.url" :width="64" /></td>
              <td>Чек #{{ i + 1 }}</td>
              <td>
                <VChip :color="file.color">{{ file.status }}</VChip>
              </td>
            </tr>
          </tbody>
        </VTable>
      </template>
      <template #actions>
        <VSpacer />
        <v-btn
          color="primary"
          variant="outlined"
          text="Отмена"
          @click="close"
        />
        <v-btn
          color="primary"
          variant="elevated"
          @click="run"
          :disabled="
            files.filter((f) => f.status == 'не обработан').length == 0
          "
        >
          Начать заполнение
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
