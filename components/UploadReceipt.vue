<script lang="ts" setup>
const emits = defineEmits(["save"]);
const opened = defineModel<boolean>();
const props = defineProps<{
  loading: boolean;
}>();

const upload = (file: File) => {
  emits("save", file);
};

const close = () => {
  opened.value = false;
};
</script>

<template>
  <v-dialog v-model="opened" :max-width="510">
    <VCard
      :loading="loading"
      title="Поиск по чеку"
      subtitle="Загрузите чек, чтобы найти подходящие записи"
    >
      <template #text>
        <VRow class="pt-4">
          <VCol class="d-flex flex-column align-center ga-4">
            <VImg src="/images/hand.png" :width="128" />
            <Dropzone accept="image/png" @upload="upload" />
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
      </template>
      <template #append>
        <v-btn icon="mdi-close" flat @click="close" />
      </template>
    </VCard>
  </v-dialog>
</template>
