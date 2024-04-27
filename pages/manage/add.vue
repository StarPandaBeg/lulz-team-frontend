<script lang="ts" setup>
import { useToast } from "vue-toastification";
import { useTitledPageStore } from "~/store/titled";
import { getDefaultTrip, type Trip } from "~/types/trip";

definePageMeta({
  layout: "titled",
});
useHead({
  title: "Добавление записи",
});

const templateStore = useTitledPageStore();
const toast = useToast();
const router = useRouter();
const { $api } = useNuxtApp();
const trip = ref<Trip>(getDefaultTrip());
const file = ref<File>();
const loading = ref<boolean>();

const save = async () => {
  try {
    loading.value = true;

    const result = await $api.trips.create(trip.value);
    const id = result.id;
    const parseResult = await $api.parser.uploadTrip(file.value!, id);
    if (parseResult.ok) {
      toast.success("Успешно!");
      router.push(`/manage/${id}`);
    }
  } catch (e) {
    console.log(e);
    toast.error("При сохранении произошла ошибка");
  }
  loading.value = false;
};

onMounted(() => {
  templateStore.setTitle("Добавление записи");
  templateStore.clearActions();

  templateStore.addAction({
    props: {
      color: "primary",
      variant: "outlined",
      to: "/",
    },
    text: "Отмена",
  });
  templateStore.addAction({
    props: {
      color: "primary",
    },
    text: "Сохранить",
    events: {
      click: save,
    },
  });
});
</script>

<template>
  <VForm>
    <VCard :disabled="loading" :loading="loading">
      <template #text>
        <VRow class="d-flex align-center">
          <VCol cols="2">ФИО</VCol>
          <VCol>
            <VTextField
              v-model="trip.fio"
              label="ФИО"
              variant="outlined"
              hide-details
            />
          </VCol>
        </VRow>
        <VRow class="d-flex align-center">
          <VCol cols="2">Дата начала командировки</VCol>
          <VCol cols="4">
            <VTextField
              v-model="trip.date_start"
              type="date"
              label="Дата начала"
              variant="outlined"
              hide-details
            />
          </VCol>
          <VCol cols="2">Дата окончания командировки</VCol>
          <VCol cols="4">
            <VTextField
              v-model="trip.date_end"
              type="date"
              label="Дата окончания"
              variant="outlined"
              hide-details
            />
          </VCol>
        </VRow>
        <VRow class="d-flex align-center">
          <VCol cols="2">Выписка (.xlsx)</VCol>
          <VCol>
            <VFileInput
              v-model="file"
              label="Файл выписки"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              variant="outlined"
              hide-details
            />
          </VCol>
        </VRow>
      </template>
    </VCard>
  </VForm>
</template>
