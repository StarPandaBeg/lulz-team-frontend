<script setup lang="ts">
const emits = defineEmits(["save"]);
const opened = defineModel<boolean>();

const close = () => {
  opened.value = false;
};
const save = () => {
  emits("save");
};
</script>

<template>
  <v-dialog v-model="opened" :max-width="400">
    <v-card title="Сгенерировать отчёт?">
      <template #actions>
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          text="Отмена"
          @click="close"
        />
        <v-btn color="primary" variant="elevated" @click="save"> Да </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
