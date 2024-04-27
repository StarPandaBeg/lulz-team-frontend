<script lang="ts" setup>
import { useToast } from "vue-toastification";
import { useDropzone, type FileRejectReason } from "vue3-dropzone";

const emits = defineEmits(["upload"]);
const props = defineProps<{
  accept: string;
}>();
const toast = useToast();

const onDrop = (acceptFiles: File[], rejectReasons: FileRejectReason[]) => {
  acceptFiles.forEach((file) => emits("upload", file));
  rejectReasons.forEach((reason) => toast.error(reason.errors[0].message));
};

const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: props.accept,
});
const isDragActive = rest.isDragActive;
</script>

<template>
  <div class="dropzone" :class="{ active: isDragActive }">
    <div v-bind="getRootProps()">
      <input v-bind="getInputProps()" />
      <p v-if="isDragActive">Переместите файл сюда</p>
      <p v-else>Перетащите сюда файлы или нажмите для выбора</p>
    </div>
  </div>
</template>

<style lang="scss">
.dropzone {
  padding: 20px 10px;
  border: 2px dashed #bbb;
  border-radius: 5px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &.active {
    background: #bbb;
  }
}
</style>
